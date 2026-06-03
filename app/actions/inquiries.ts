"use server";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { db } from "@/db/client";
import { inquiries, products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { sendInquiryEmails } from "@/lib/email";
import { inquirySchema } from "@/lib/validation/inquiry";

export type SubmitInquiryResult =
  | { ok: true; id: string }
  | {
      ok: false;
      error: string;
      fieldErrors?: Record<string, string[] | undefined>;
    };

/**
 * Server action used by ContactForm (and later by ProductQuoteForm).
 * Reads from FormData so it works with progressive-enhancement —
 * the form posts to the server even without JS.
 *
 * Flow:
 *   1. Parse + Zod-validate the form fields.
 *   2. Honeypot check — silently drop bot submissions.
 *   3. Insert into `inquiries` with hashed IP + user-agent for spam analysis.
 *   4. (Phase 3) trigger Resend emails — not wired yet.
 */
export async function submitInquiry(
  _prev: SubmitInquiryResult | null,
  formData: FormData,
): Promise<SubmitInquiryResult> {
  const raw = Object.fromEntries(formData.entries());

  // Treat empty optional fields as undefined so Zod's `.optional()` works.
  const cleaned = Object.fromEntries(
    Object.entries(raw).map(([k, v]) => [k, v === "" ? undefined : v]),
  );

  const parsed = inquirySchema.safeParse(cleaned);

  if (!parsed.success) {
    return {
      ok: false,
      error: "Please check the form for errors.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  // Honeypot — pretend success so bots don't retry.
  if (parsed.data.website) {
    return { ok: true, id: "dropped" };
  }

  // Privacy: hash IP + truncate. We never store the raw IP.
  const h = await headers();
  const rawIp =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    h.get("x-real-ip") ??
    "unknown";
  const ipHash = createHash("sha256").update(rawIp).digest("hex").slice(0, 32);
  const userAgent = h.get("user-agent")?.slice(0, 500) ?? null;

  try {
    const [row] = await db
      .insert(inquiries)
      .values({
        name: parsed.data.name,
        company: parsed.data.company || null,
        email: parsed.data.email,
        phone: parsed.data.phone || null,
        productId: parsed.data.productId || null,
        message: parsed.data.message,
        quantity: parsed.data.quantity ?? null,
        source: parsed.data.source,
        ipHash,
        userAgent,
      })
      .returning({ id: inquiries.id });

    // Fetch product title if this inquiry is tied to one, so the email
    // subject can show it. Done after the insert so the inquiry lands
    // even if this lookup fails.
    let productTitle: string | null = null;
    if (parsed.data.productId) {
      try {
        const [p] = await db
          .select({ title: products.title })
          .from(products)
          .where(eq(products.id, parsed.data.productId))
          .limit(1);
        productTitle = p?.title ?? null;
      } catch {
        // Non-fatal — email just won't include the title.
      }
    }

    // Send admin notification + user confirmation. Awaited so the
    // function stays warm until both attempts settle (Resend typically
    // resolves in <1s). Failures are logged to `emailLog` and do not
    // surface to the caller — the inquiry is already saved.
    await sendInquiryEmails({
      inquiryId: row.id,
      name: parsed.data.name,
      company: parsed.data.company || null,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      message: parsed.data.message,
      quantity: parsed.data.quantity ?? null,
      source: parsed.data.source,
      productTitle,
    });

    return { ok: true, id: row.id };
  } catch (err) {
    // Surfaces in Vercel function logs.
    console.error("submitInquiry failed", err);
    return {
      ok: false,
      error:
        "Something went wrong on our end. Please try again, or reach us on WhatsApp.",
    };
  }
}
