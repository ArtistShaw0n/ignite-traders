"use server";

import bcrypt from "bcryptjs";
import { and, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db/client";
import { adminUsers } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";

export type AdminActionResult = { ok: true } | { ok: false; error: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function addAdmin(
  _prev: AdminActionResult | null,
  formData: FormData,
): Promise<AdminActionResult> {
  const me = await requireAdmin();

  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!EMAIL_RE.test(email)) {
    return { ok: false, error: "Enter a valid email address." };
  }
  if (password.length < 8) {
    return { ok: false, error: "Password must be at least 8 characters." };
  }

  const [existing] = await db
    .select({ id: adminUsers.id })
    .from(adminUsers)
    .where(eq(adminUsers.email, email))
    .limit(1);
  if (existing) {
    return { ok: false, error: "That email is already an admin." };
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    await db.insert(adminUsers).values({ email, passwordHash, addedBy: me.email });
    revalidatePath("/admin/admins");
  } catch (err) {
    console.error("addAdmin failed", err);
    return { ok: false, error: "Could not add the admin. Please retry." };
  }

  return { ok: true };
}

export async function removeAdmin(id: string): Promise<{ ok: boolean; error?: string }> {
  const me = await requireAdmin();

  try {
    const [target] = await db.select().from(adminUsers).where(eq(adminUsers.id, id)).limit(1);
    if (!target) return { ok: false, error: "Admin not found." };

    if (target.email.toLowerCase() === me.email.toLowerCase()) {
      return { ok: false, error: "You can't remove your own admin access." };
    }

    // Atomic last-admin guard: delete only when more than one admin exists,
    // so concurrent removals can't drain the table to zero.
    const deleted = await db
      .delete(adminUsers)
      .where(and(eq(adminUsers.id, id), sql`(select count(*) from admin_users) > 1`))
      .returning({ id: adminUsers.id });
    if (deleted.length === 0) {
      return { ok: false, error: "Can't remove the last admin." };
    }

    revalidatePath("/admin/admins");
    return { ok: true };
  } catch (err) {
    console.error("removeAdmin failed", err);
    return { ok: false, error: "Could not remove the admin." };
  }
}
