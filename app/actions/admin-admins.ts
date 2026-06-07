"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db/client";
import { adminUsers } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { ENV_ADMIN_EMAILS } from "@/lib/admins";

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

  if (!email || !EMAIL_RE.test(email)) {
    return { ok: false, error: "Enter a valid email address." };
  }
  if (ENV_ADMIN_EMAILS.includes(email)) {
    return { ok: false, error: "That email is already a permanent admin." };
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
    await db.insert(adminUsers).values({ email, addedBy: me.email });
    revalidatePath("/admin/admins");
  } catch (err) {
    console.error("addAdmin failed", err);
    return { ok: false, error: "Could not add the admin. Please retry." };
  }

  return { ok: true };
}

export async function removeAdmin(id: string): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin();

  try {
    await db.delete(adminUsers).where(eq(adminUsers.id, id));
    revalidatePath("/admin/admins");
    return { ok: true };
  } catch (err) {
    console.error("removeAdmin failed", err);
    return { ok: false, error: "Could not remove the admin." };
  }
}
