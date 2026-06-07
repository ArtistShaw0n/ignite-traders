import { Resend } from "resend";
import { db } from "@/db/client";
import { emailLog, type NewEmailLog } from "@/db/schema";
import { AdminNotificationEmail } from "@/emails/admin-notification";
import { UserConfirmationEmail } from "@/emails/user-confirmation";
import { SITE_LEGAL_NAME, SITE_WHATSAPP } from "@/lib/site";

/**
 * Resend wrapper used by the inquiry server action.
 *
 * - Lazily reads the API key so `next build` succeeds without it.
 * - Logs every send attempt to the `emailLog` table for visibility.
 * - Never throws back to the caller — email failures shouldn't tank
 *   form submissions (the DB row was already saved).
 */
let cachedClient: Resend | null = null;

function getResend(): Resend | null {
  if (cachedClient) return cachedClient;
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn(
      "[email] RESEND_API_KEY not set — skipping email send. Add it to Vercel env vars.",
    );
    return null;
  }
  cachedClient = new Resend(key);
  return cachedClient;
}

// `||` not `??` throughout — env vars set to an empty string ("") should
// fall back to the default, but `??` only catches null/undefined. We hit
// exactly this with ADMIN_EMAIL="" silently routing admin mail to nowhere.
function getFrom(): string {
  return (
    process.env.RESEND_FROM_EMAIL || `${SITE_LEGAL_NAME} <no-reply@ignitetradersbd.com>`
  );
}

function getAdminEmail(): string {
  return process.env.ADMIN_EMAIL || "shawon221b@gmail.com";
}

function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || "https://ignitetradersbd.com";
}

async function logSend(entry: NewEmailLog): Promise<void> {
  try {
    await db.insert(emailLog).values(entry);
  } catch (err) {
    // Don't let a logging failure crash the request.
    console.error("[email] failed to write emailLog row", err);
  }
}

// ---- Public API ----

export interface InquiryEmailInput {
  inquiryId: string;
  name: string;
  company?: string | null;
  email: string;
  phone?: string | null;
  message: string;
  quantity?: number | null;
  source?: string | null;
  productTitle?: string | null;
}

/**
 * Fire-and-forget: sends both admin + user confirmation emails after
 * an inquiry lands. Each send is independent — one failing doesn't
 * block the other.
 */
export async function sendInquiryEmails(input: InquiryEmailInput): Promise<void> {
  const resend = getResend();
  if (!resend) return;

  const from = getFrom();
  const siteUrl = getSiteUrl();
  const whatsappLink = `https://wa.me/${SITE_WHATSAPP}?text=${encodeURIComponent(
    `Hi! Following up on my inquiry (ref ${input.inquiryId.slice(0, 8)}).`,
  )}`;

  // Run in parallel — independent failure paths.
  await Promise.allSettled([
    // Admin notification
    (async () => {
      try {
        const { data, error } = await resend.emails.send({
          from,
          to: getAdminEmail(),
          replyTo: input.email,
          subject: input.productTitle
            ? `[IGNITE Lead] ${input.productTitle} — ${input.name}${input.company ? ` (${input.company})` : ""}`
            : `[IGNITE Lead] New inquiry — ${input.name}${input.company ? ` (${input.company})` : ""}`,
          react: AdminNotificationEmail({
            name: input.name,
            company: input.company,
            email: input.email,
            phone: input.phone,
            message: input.message,
            quantity: input.quantity,
            source: input.source,
            inquiryId: input.inquiryId,
            productTitle: input.productTitle,
            siteUrl,
          }),
        });

        if (error) throw error;

        await logSend({
          inquiryId: input.inquiryId,
          toEmail: getAdminEmail(),
          template: "admin-notification",
          resendId: data?.id ?? null,
          status: "sent",
        });
      } catch (err) {
        console.error("[email] admin notification failed", err);
        await logSend({
          inquiryId: input.inquiryId,
          toEmail: getAdminEmail(),
          template: "admin-notification",
          status: "failed",
          error: err instanceof Error ? err.message : String(err),
        });
      }
    })(),

    // User confirmation
    (async () => {
      try {
        const { data, error } = await resend.emails.send({
          from,
          to: input.email,
          subject: input.productTitle
            ? `We got your inquiry about ${input.productTitle} — IGNITE Traders`
            : "We got your inquiry — IGNITE Traders",
          react: UserConfirmationEmail({
            name: input.name,
            message: input.message,
            productTitle: input.productTitle,
            inquiryId: input.inquiryId,
            whatsappLink,
            siteUrl,
          }),
        });

        if (error) throw error;

        await logSend({
          inquiryId: input.inquiryId,
          toEmail: input.email,
          template: "user-confirmation",
          resendId: data?.id ?? null,
          status: "sent",
        });
      } catch (err) {
        console.error("[email] user confirmation failed", err);
        await logSend({
          inquiryId: input.inquiryId,
          toEmail: input.email,
          template: "user-confirmation",
          status: "failed",
          error: err instanceof Error ? err.message : String(err),
        });
      }
    })(),
  ]);
}
