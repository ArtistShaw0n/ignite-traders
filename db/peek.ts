import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

import { desc } from "drizzle-orm";
import { db } from "./client";
import { inquiries, emailLog } from "./schema";

async function main() {
  // Latest inquiries
  const inq = await db
    .select()
    .from(inquiries)
    .orderBy(desc(inquiries.createdAt))
    .limit(5);

  console.log(`\n📥 Recent inquiries: ${inq.length}\n`);
  for (const r of inq) {
    console.log("─".repeat(60));
    console.log(`id:       ${r.id}`);
    console.log(`name:     ${r.name}`);
    console.log(`email:    ${r.email}`);
    console.log(`message:  ${r.message.slice(0, 80)}${r.message.length > 80 ? "..." : ""}`);
    console.log(`source:   ${r.source ?? "-"}`);
    console.log(`status:   ${r.status}`);
    console.log(`created:  ${r.createdAt.toISOString()}`);
  }
  console.log("─".repeat(60));

  // Latest email log entries
  const logs = await db
    .select()
    .from(emailLog)
    .orderBy(desc(emailLog.createdAt))
    .limit(10);

  console.log(`\n📧 Recent email log entries: ${logs.length}\n`);
  for (const l of logs) {
    console.log("─".repeat(60));
    console.log(`id:        ${l.id}`);
    console.log(`inquiry:   ${l.inquiryId ?? "-"}`);
    console.log(`to:        ${l.toEmail}`);
    console.log(`template:  ${l.template}`);
    console.log(`status:    ${l.status}`);
    console.log(`resendId:  ${l.resendId ?? "-"}`);
    console.log(`error:     ${l.error ?? "-"}`);
    console.log(`created:   ${l.createdAt.toISOString()}`);
  }
  console.log("─".repeat(60));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
