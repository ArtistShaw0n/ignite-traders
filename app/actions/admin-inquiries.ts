"use server";

import { sql, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db/client";
import { inquiries } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { INQUIRY_STATUSES, type InquiryStatus } from "@/lib/inquiry-status";

export type UpdateStatusResult = { ok: true; status: InquiryStatus } | { ok: false; error: string };

/**
 * Admin-only — move an inquiry through its pipeline
 * (new → replied → quoted → won / lost).
 *
 * requireAdmin() runs first: a non-admin caller is redirected before any
 * DB write can happen, so this is safe to import into client components.
 */
export async function updateInquiryStatus(id: string, status: string): Promise<UpdateStatusResult> {
  await requireAdmin();

  if (!INQUIRY_STATUSES.includes(status as InquiryStatus)) {
    return { ok: false, error: "Invalid status value." };
  }

  try {
    await db
      .update(inquiries)
      .set({ status: status as InquiryStatus, updatedAt: sql`now()` })
      .where(eq(inquiries.id, id));
  } catch (err) {
    console.error("updateInquiryStatus failed", err);
    return { ok: false, error: "Could not update status. Please retry." };
  }

  // Admin pages are dynamic, but revalidating makes the change show up
  // immediately when the action is invoked without a navigation.
  revalidatePath("/admin");
  revalidatePath("/admin/inquiries");
  revalidatePath(`/admin/inquiries/${id}`);

  return { ok: true, status: status as InquiryStatus };
}
