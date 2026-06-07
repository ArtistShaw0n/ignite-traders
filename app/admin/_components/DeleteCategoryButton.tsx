"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteCategory } from "@/app/actions/admin-categories";

export function DeleteCategoryButton({ id, label }: { id: string; label: string }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function onDelete() {
    if (!window.confirm(`Delete category "${label}"? This can't be undone.`)) {
      return;
    }
    startTransition(async () => {
      const res = await deleteCategory(id);
      if (res.ok) {
        router.push("/admin/categories");
      } else {
        window.alert(res.error ?? "Could not delete the category.");
      }
    });
  }

  return (
    <button
      type="button"
      onClick={onDelete}
      disabled={pending}
      className="inline-flex items-center gap-1.5 rounded-md border border-red-300 px-3 py-1.5 text-body-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
    >
      <Trash2 size={16} aria-hidden="true" />
      {pending ? "Deleting…" : "Delete"}
    </button>
  );
}
