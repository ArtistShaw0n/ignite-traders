import "server-only";

import { asc, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { adminUsers } from "@/db/schema";

export interface AdminListItem {
  id: string;
  email: string;
  addedBy: string | null;
  createdAt: Date;
}

/** Every admin (email + bcrypt password live in admin_users). */
export async function listAdmins(): Promise<AdminListItem[]> {
  const rows = await db.select().from(adminUsers).orderBy(asc(adminUsers.email));
  return rows.map((r) => ({
    id: r.id,
    email: r.email.toLowerCase(),
    addedBy: r.addedBy,
    createdAt: r.createdAt,
  }));
}

export async function countAdmins(): Promise<number> {
  const [{ count }] = await db.select({ count: sql<number>`count(*)::int` }).from(adminUsers);
  return count;
}
