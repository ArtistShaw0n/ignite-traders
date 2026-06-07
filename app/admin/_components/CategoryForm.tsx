"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/atoms/Button";
import { clsx } from "@/lib/clsx";
import type { CategoryActionResult } from "@/app/actions/admin-categories";

export interface CategoryFormInitial {
  label?: string;
  slug?: string;
  sortOrder?: number;
}

export function CategoryForm({
  action,
  initial,
  submitLabel,
}: {
  action: (
    prev: CategoryActionResult | null,
    fd: FormData,
  ) => Promise<CategoryActionResult>;
  initial?: CategoryFormInitial;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, null);
  const fe = state && !state.ok ? state.fieldErrors : undefined;

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Label"
          name="label"
          defaultValue={initial?.label}
          required
          error={fe?.label}
          hint="Shown on the site, e.g. Protective Gown"
        />
        <Field
          label="Slug"
          name="slug"
          defaultValue={initial?.slug}
          required
          error={fe?.slug}
          hint="lowercase-with-hyphens (used in URLs)"
        />
      </div>

      <Field
        label="Sort order"
        name="sortOrder"
        type="number"
        defaultValue={(initial?.sortOrder ?? 0).toString()}
        hint="Lower numbers appear first"
        error={fe?.sortOrder}
        className="max-w-[180px]"
      />

      {state && !state.ok && state.error && (
        <p role="alert" className="text-body-sm text-red-600">
          {state.error}
        </p>
      )}

      <div className="flex items-center gap-4 pt-2">
        <Button type="submit" size="md" disabled={pending}>
          {pending ? "Saving…" : submitLabel}
        </Button>
        <Link
          href="/admin/categories"
          className="text-body-sm text-[var(--fg-muted)] hover:text-[var(--fg-primary)]"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  required,
  hint,
  error,
  type = "text",
  className,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  hint?: string;
  error?: string[];
  type?: "text" | "number";
  className?: string;
}) {
  const hasError = !!error?.length;
  return (
    <div className={className}>
      <label className="block">
        <span className="text-body-sm font-semibold text-[var(--fg-primary)]">
          {label}
          {required && <span className="text-red-600"> *</span>}
        </span>
        <input
          type={type}
          name={name}
          defaultValue={defaultValue}
          required={required}
          min={type === "number" ? 0 : undefined}
          className={clsx(
            "mt-1 block w-full rounded-md border bg-white px-3 py-2 text-body shadow-sm transition-colors focus:outline-none focus:ring-1",
            hasError
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border-[var(--border-default)] focus:border-brand-500 focus:ring-brand-500",
          )}
        />
        {hint && !hasError && (
          <span className="mt-1 block text-caption text-[var(--fg-muted)]">
            {hint}
          </span>
        )}
        {hasError && (
          <span className="mt-1 block text-caption text-red-600">
            {error![0]}
          </span>
        )}
      </label>
    </div>
  );
}
