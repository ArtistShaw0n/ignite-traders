"use client";

import { useActionState, useEffect, useRef } from "react";
import { Button } from "@/components/atoms/Button";
import { addAdmin } from "@/app/actions/admin-admins";

const inputClass =
  "mt-1 block max-w-full rounded-md border border-[var(--border-default)] bg-white px-3 py-2 text-body shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500";

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
          className={`${inputClass} w-64`}
        />
      </label>
      <label className="block">
        <span className="text-body-sm font-semibold text-[var(--fg-primary)]">
          Initial password
        </span>
        <input
          type="password"
          name="password"
          required
          minLength={8}
          autoComplete="new-password"
          placeholder="min 8 characters"
          className={`${inputClass} w-56`}
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
      {state?.ok && (
        <p className="w-full text-body-sm text-emerald-700">
          Admin added — share the password with them.
        </p>
      )}
    </form>
  );
}
