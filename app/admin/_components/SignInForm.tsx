"use client";

import { useActionState } from "react";
import { authenticate } from "@/app/actions/auth";
import { Button } from "@/components/atoms/Button";

const inputClass =
  "mt-1 block w-full rounded-md border border-[var(--border-default)] bg-white px-3 py-2 text-body shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500";

export function SignInForm() {
  const [error, formAction, pending] = useActionState(authenticate, null);

  return (
    <form action={formAction} className="space-y-4">
      <label className="block">
        <span className="text-body-sm font-semibold text-[var(--fg-primary)]">Email</span>
        <input type="email" name="email" required autoComplete="email" className={inputClass} />
      </label>
      <label className="block">
        <span className="text-body-sm font-semibold text-[var(--fg-primary)]">Password</span>
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          className={inputClass}
        />
      </label>
      {error && (
        <p role="alert" className="text-body-sm text-red-600">
          {error}
        </p>
      )}
      <Button type="submit" size="md" fullWidth disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
