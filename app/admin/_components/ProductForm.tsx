"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/atoms/Button";
import { clsx } from "@/lib/clsx";
import { BADGE_COLORS, type ProductImage } from "@/lib/validation/product";
import type { ProductActionResult } from "@/app/actions/admin-products";
import { ImageUploader } from "@/app/admin/_components/ImageUploader";

export interface ProductFormInitial {
  slug?: string;
  title?: string;
  categorySlug?: string;
  description?: string;
  sizes?: string; // comma-joined for the input
  sku?: string;
  material?: string;
  usageArea?: string;
  bulkSupply?: string;
  badgeColor?: string; // "" | bestseller | bulk | new
  featured?: boolean;
  bestseller?: boolean;
  isProtectiveGown?: boolean;
  sortOrder?: number;
  images?: ProductImage[];
}

type FieldErrors = Record<string, string[] | undefined> | undefined;

export function ProductForm({
  action,
  initial,
  submitLabel,
  categories,
}: {
  action: (prev: ProductActionResult | null, fd: FormData) => Promise<ProductActionResult>;
  initial?: ProductFormInitial;
  submitLabel: string;
  categories: { slug: string; label: string }[];
}) {
  const [state, formAction, pending] = useActionState(action, null);
  const fe: FieldErrors = state && !state.ok ? state.fieldErrors : undefined;

  // Images held in state — the uploader pushes Blob URLs here and they ride
  // along in the hidden field on submit.
  const [images, setImages] = useState<ProductImage[]>(initial?.images ?? []);

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="images" value={JSON.stringify(images)} />

      <div className="grid gap-5 sm:grid-cols-2">
        <Text label="Title" name="title" defaultValue={initial?.title} required error={fe?.title} />
        <Text
          label="Slug"
          name="slug"
          defaultValue={initial?.slug}
          required
          error={fe?.slug}
          hint="lowercase-with-hyphens (used in the URL)"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Select
          label="Category"
          name="categorySlug"
          defaultValue={initial?.categorySlug ?? ""}
          required
          error={fe?.categorySlug}
          options={[
            { value: "", label: "Select a category…" },
            ...categories.map((c) => ({
              value: c.slug,
              label: c.label,
            })),
          ]}
        />
        <Select
          label="Badge"
          name="badgeColor"
          defaultValue={initial?.badgeColor ?? ""}
          options={[
            { value: "", label: "None" },
            ...BADGE_COLORS.map((b) => ({
              value: b,
              label: b.charAt(0).toUpperCase() + b.slice(1),
            })),
          ]}
        />
      </div>

      <Text
        label="Sizes"
        name="sizes"
        defaultValue={initial?.sizes}
        hint="Comma-separated, e.g. S, M, L, XL"
        error={fe?.sizes}
      />

      <Textarea
        label="Description"
        name="description"
        defaultValue={initial?.description}
        required
        rows={3}
        error={fe?.description}
      />

      <ImageUploader value={images} onChange={setImages} />

      <div className="grid gap-5 sm:grid-cols-2">
        <Text label="SKU" name="sku" defaultValue={initial?.sku} required error={fe?.sku} />
        <Text
          label="Material"
          name="material"
          defaultValue={initial?.material}
          required
          error={fe?.material}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Text
          label="Usage area"
          name="usageArea"
          defaultValue={initial?.usageArea}
          required
          error={fe?.usageArea}
        />
        <Text
          label="Bulk supply"
          name="bulkSupply"
          defaultValue={initial?.bulkSupply}
          required
          error={fe?.bulkSupply}
        />
      </div>

      <div className="flex flex-wrap gap-x-8 gap-y-3 rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface-muted)] p-4">
        <Check label="Featured (home grid)" name="featured" defaultChecked={initial?.featured} />
        <Check label="Bestseller" name="bestseller" defaultChecked={initial?.bestseller} />
        <Check
          label="Protective-gown section"
          name="isProtectiveGown"
          defaultChecked={initial?.isProtectiveGown}
        />
      </div>

      <Text
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
          href="/admin/products"
          className="text-body-sm text-[var(--fg-muted)] hover:text-[var(--fg-primary)]"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}

// ---------- fields ----------

const fieldClass = (hasError: boolean) =>
  clsx(
    "mt-1 block w-full rounded-md border bg-white px-3 py-2 text-body shadow-sm transition-colors",
    "focus:outline-none focus:ring-1",
    hasError
      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
      : "border-[var(--border-default)] focus:border-brand-500 focus:ring-brand-500",
  );

function Label({
  label,
  required,
  children,
  hint,
  error,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
  error?: string[];
}) {
  const hasError = !!error?.length;
  return (
    <label className="block">
      <span className="text-body-sm font-semibold text-[var(--fg-primary)]">
        {label}
        {required && <span className="text-red-600"> *</span>}
      </span>
      {children}
      {hint && !hasError && (
        <span className="mt-1 block text-caption text-[var(--fg-muted)]">{hint}</span>
      )}
      {hasError && <span className="mt-1 block text-caption text-red-600">{error![0]}</span>}
    </label>
  );
}

function Text({
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
  return (
    <div className={className}>
      <Label label={label} required={required} hint={hint} error={error}>
        <input
          type={type}
          name={name}
          defaultValue={defaultValue}
          required={required}
          min={type === "number" ? 0 : undefined}
          className={fieldClass(!!error?.length)}
        />
      </Label>
    </div>
  );
}

function Textarea({
  label,
  name,
  defaultValue,
  required,
  rows = 3,
  error,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  rows?: number;
  error?: string[];
}) {
  return (
    <Label label={label} required={required} error={error}>
      <textarea
        name={name}
        defaultValue={defaultValue}
        required={required}
        rows={rows}
        className={fieldClass(!!error?.length)}
      />
    </Label>
  );
}

function Select({
  label,
  name,
  defaultValue,
  required,
  error,
  options,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  error?: string[];
  options: { value: string; label: string }[];
}) {
  return (
    <Label label={label} required={required} error={error}>
      <select
        name={name}
        defaultValue={defaultValue}
        required={required}
        className={fieldClass(!!error?.length)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Label>
  );
}

function Check({
  label,
  name,
  defaultChecked,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="inline-flex items-center gap-2 text-body-sm font-medium">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="h-4 w-4 rounded border-[var(--border-default)] text-brand-600 focus:ring-brand-500"
      />
      {label}
    </label>
  );
}
