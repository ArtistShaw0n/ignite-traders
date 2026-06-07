import { Webhook } from "svix";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { emailLog } from "@/db/schema";

/**
 * Resend delivery webhook. Resend signs payloads with Svix; we verify the
 * signature with RESEND_WEBHOOK_SECRET (the `whsec_…` value shown when you
 * create the webhook in the Resend dashboard) and then advance the matching
 * email_log row's status.
 *
 * Not behind admin auth — it's a machine-to-machine call. The svix signature
 * IS the authentication here.
 */
type ResendEvent = {
  type?: string;
  data?: { email_id?: string; bounce?: { message?: string } | unknown };
};

const STATUS_MAP: Record<string, "sent" | "delivered" | "bounced"> = {
  "email.sent": "sent",
  "email.delivered": "delivered",
  "email.bounced": "bounced",
  "email.complained": "bounced",
};

export async function POST(request: Request) {
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[resend-webhook] RESEND_WEBHOOK_SECRET is not set");
    return new Response("Webhook not configured", { status: 500 });
  }

  const payload = await request.text();
  const headers = {
    "svix-id": request.headers.get("svix-id") ?? "",
    "svix-timestamp": request.headers.get("svix-timestamp") ?? "",
    "svix-signature": request.headers.get("svix-signature") ?? "",
  };

  let event: ResendEvent;
  try {
    const wh = new Webhook(secret);
    event = wh.verify(payload, headers) as ResendEvent;
  } catch (err) {
    console.error("[resend-webhook] signature verification failed", err);
    return new Response("Invalid signature", { status: 400 });
  }

  const type = event.type ?? "";
  const emailId = event.data?.email_id;
  const status = STATUS_MAP[type];

  if (emailId && status) {
    const bounceMsg =
      status === "bounced" &&
      event.data?.bounce &&
      typeof event.data.bounce === "object" &&
      "message" in event.data.bounce
        ? String((event.data.bounce as { message?: string }).message ?? "")
        : null;

    try {
      await db
        .update(emailLog)
        .set({ status, ...(bounceMsg ? { error: bounceMsg } : {}) })
        .where(eq(emailLog.resendId, emailId));
    } catch (err) {
      // Log but still 200 — the signature was valid; a transient DB error
      // shouldn't make Resend hammer us with retries.
      console.error("[resend-webhook] failed to update email_log", err);
    }
  }

  return new Response("ok", { status: 200 });
}
