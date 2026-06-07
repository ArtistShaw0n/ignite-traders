"use client";

import { useActionState, useEffect, useRef } from "react";
import { Button } from "@/components/atoms/Button";
import { addAdmin } from "@/app/actions/admin-admins";

export function AddAdminForm() {
  const [state, formAction, pending] = useActionState(addAdmin, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-wrap items-end gap-3">
      <label className="block">
        <span className="text-body-sm font-semibold text-[var(--fg-primary)]">Admin email</span>
        <input
          type="email"
          name="email"
          required
          placeholder="name@example.com"
          className="mt-1 block w-72 max-w-full rounded-md border border-[var(--border-default)] bg-white px-3 py-2 text-body shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
      </label>
      <Button type="submit" size="md" disabled={pending}>
        {pending ? "Adding…" : "Add admin"}
      </Button>
      {state?.ok === false && (
        <p role="alert" className="w-full text-body-sm text-red-600">
          {state.error}
        </p>
      )}
      {state?.ok && <p className="w-full text-body-sm text-emerald-700">Admin added.</p>}
    </form>
  );
}
