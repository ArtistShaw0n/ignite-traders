import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

import { desc } from "drizzle-orm";
import { db } from "./client";
import { inquiries } from "./schema";

async function main() {
  const rows = await db
    .select()
    .from(inquiries)
    .orderBy(desc(inquiries.createdAt))
    .limit(10);

  console.log(`\n📥 Total recent inquiries: ${rows.length}\n`);
  for (const r of rows) {
    console.log("─".repeat(60));
    console.log(`id:        ${r.id}`);
    console.log(`name:      ${r.name}`);
    console.log(`company:   ${r.company ?? "-"}`);
    console.log(`email:     ${r.email}`);
    console.log(`phone:     ${r.phone ?? "-"}`);
    console.log(`message:   ${r.message.slice(0, 80)}${r.message.length > 80 ? "..." : ""}`);
    console.log(`source:    ${r.source ?? "-"}`);
    console.log(`status:    ${r.status}`);
    console.log(`created:   ${r.createdAt.toISOString()}`);
  }
  console.log("─".repeat(60));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
