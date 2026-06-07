import { getAdminUser } from "@/lib/auth";
import { getInquiries } from "@/lib/inquiries";

/** Quote every field and escape embedded quotes — safe for commas/newlines. */
function csvCell(value: unknown): string {
  const s =
    value === null || value === undefined
      ? ""
      : value instanceof Date
        ? value.toISOString()
        : String(value);
  return `"${s.replace(/"/g, '""')}"`;
}

const COLUMNS: { header: string; key: string }[] = [
  { header: "id", key: "id" },
  { header: "received_at", key: "createdAt" },
  { header: "name", key: "name" },
  { header: "company", key: "company" },
  { header: "email", key: "email" },
  { header: "phone", key: "phone" },
  { header: "product", key: "productTitle" },
  { header: "quantity", key: "quantity" },
  { header: "status", key: "status" },
  { header: "source", key: "source" },
  { header: "message", key: "message" },
];

export async function GET() {
  // Defence in depth — middleware already gates /admin/*, but return a
  // clean 403 here too rather than redirecting a file download.
  const admin = await getAdminUser();
  if (!admin) {
    return new Response("Forbidden", { status: 403 });
  }

  const rows = await getInquiries();

  const lines = [
    COLUMNS.map((c) => csvCell(c.header)).join(","),
    ...rows.map((row) =>
      COLUMNS.map((c) => csvCell((row as Record<string, unknown>)[c.key])).join(","),
    ),
  ];
  // Prepend a UTF-8 BOM so Excel opens it with correct encoding.
  const body = "﻿" + lines.join("\r\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="ignite-inquiries.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
