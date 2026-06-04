import "server-only";

import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { inquiries, emailLog, products } from "@/db/schema";
import type { Inquiry, EmailLog } from "@/db/schema";
import type { InquiryStatus } from "./inquiry-status";

export type { InquiryStatus } from "./inquiry-status";
export { INQUIRY_STATUSES } from "./inquiry-status";

/** An inquiry row plus the linked product's title/slug (if any). */
export type InquiryWithProduct = Inquiry & {
  productTitle: string | null;
  productSlug: string | null;
};

function selectWithProduct() {
  return db
    .select({
      id: inquiries.id,
      name: inquiries.name,
      company: inquiries.company,
      email: inquiries.email,
      phone: inquiries.phone,
      productId: inquiries.productId,
      message: inquiries.message,
      quantity: inquiries.quantity,
      status: inquiries.status,
      source: inquiries.source,
      ipHash: inquiries.ipHash,
      userAgent: inquiries.userAgent,
      createdAt: inquiries.createdAt,
      updatedAt: inquiries.updatedAt,
      productTitle: products.title,
      productSlug: products.slug,
    })
    .from(inquiries)
    .leftJoin(products, eq(inquiries.productId, products.id));
}

export async function getInquiries(opts?: {
  status?: InquiryStatus;
}): Promise<InquiryWithProduct[]> {
  const base = selectWithProduct();
  const rows = opts?.status
    ? await base
        .where(eq(inquiries.status, opts.status))
        .orderBy(desc(inquiries.createdAt))
    : await base.orderBy(desc(inquiries.createdAt));
  return rows as InquiryWithProduct[];
}

export async function getInquiryById(
  id: string,
): Promise<InquiryWithProduct | null> {
  const [row] = await selectWithProduct()
    .where(eq(inquiries.id, id))
    .limit(1);
  return (row as InquiryWithProduct | undefined) ?? null;
}

/** Counts per status plus a grand total — drives the dashboard + filter pills. */
export async function getInquiryStatusCounts(): Promise<
  Record<InquiryStatus, number> & { total: number }
> {
  const rows = await db
    .select({
      status: inquiries.status,
      count: sql<number>`count(*)::int`,
    })
    .from(inquiries)
    .groupBy(inquiries.status);

  const counts = {
    new: 0,
    replied: 0,
    quoted: 0,
    won: 0,
    lost: 0,
    total: 0,
  };
  for (const r of rows) {
    counts[r.status] = r.count;
    counts.total += r.count;
  }
  return counts;
}

export async function getEmailLogForInquiry(
  inquiryId: string,
): Promise<EmailLog[]> {
  return db
    .select()
    .from(emailLog)
    .where(eq(emailLog.inquiryId, inquiryId))
    .orderBy(desc(emailLog.createdAt));
}

/** Most-recent inquiries for the dashboard landing. */
export async function getRecentInquiries(
  limit = 5,
): Promise<InquiryWithProduct[]> {
  const rows = await selectWithProduct()
    .orderBy(desc(inquiries.createdAt))
    .limit(limit);
  return rows as InquiryWithProduct[];
}
