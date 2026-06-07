"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { removeAdmin } from "@/app/actions/admin-admins";

export function RemoveAdminButton({ id, email }: { id: string; email: string }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function onRemove() {
    if (!window.confirm(`Remove admin access for ${email}?`)) return;
    startTransition(async () => {
      const res = await removeAdmin(id);
      if (res.ok) {
        router.refresh();
      } else {
        window.alert(res.error ?? "Could not remove the admin.");
      }
    });
  }

  return (
    <button
      type="button"
      onClick={onRemove}
      disabled={pending}
      className="inline-flex items-center gap-1.5 rounded-md border border-red-300 px-2.5 py-1 text-caption font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
    >
      <Trash2 size={14} aria-hidden="true" />
      {pending ? "Removing…" : "Remove"}
    </button>
  );
}
