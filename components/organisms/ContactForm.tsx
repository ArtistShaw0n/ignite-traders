"use client";

import { useActionState } from "react";
import { Button } from "@/components/atoms/Button";
import { submitInquiry, type SubmitInquiryResult } from "@/app/actions/inquiries";
import { clsx } from "@/lib/clsx";

const initialState: SubmitInquiryResult | null = null;

export interface ContactFormProps {
  /** Tag the submission with where on the site it came from. */
  source?: "home-hero" | "contact-page" | "product-page" | "whatsapp-fallback";
  /** Pre-link the inquiry to a specific product (used by ProductQuoteForm). */
  productId?: string;
  /** Show a quantity input — useful for product-page quote requests. */
  showQuantity?: boolean;
  /** Optional override for the submit button label. */
  submitLabel?: string;
  className?: string;
}

/**
 * Working contact form — submits via Server Action to `submitInquiry`.
 * Works without JS (HTML form posts directly); the JS layer adds
 * inline validation feedback and an optimistic pending state.
 */
export function ContactForm({
  source = "contact-page",
  productId,
  showQuantity = false,
  submitLabel = "Send Inquiry",
  className,
}: ContactFormProps) {
  const [state, formAction, pending] = useActionState(submitInquiry, initialState);

  if (state?.ok) {
    return (
      <div
        role="status"
        className={clsx(
          "rounded-xl border border-emerald-300/60 bg-emerald-50 p-6 text-emerald-950",
          className,
        )}
      >
        <h3 className="font-bold text-h4">Thanks — we got your inquiry.</h3>
        <p className="mt-2 text-body-sm leading-relaxed">
          Our procurement team typically replies within 24 hours on business days. For urgent
          requests, message us on WhatsApp for a faster response.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className={clsx("space-y-5", className)} noValidate>
      {/* Honeypot — invisible to humans, irresistible to dumb bots. */}
      <div
        aria-hidden="true"
        className="absolute -left-[9999px] top-auto w-px h-px overflow-hidden"
      >
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      <input type="hidden" name="source" value={source} />
      {productId && <input type="hidden" name="productId" value={productId} />}

      <div className="grid sm:grid-cols-2 gap-4">
        <Field
          label="Name"
          name="name"
          required
          autoComplete="name"
          error={state?.fieldErrors?.name}
        />
        <Field
          label="Company"
          name="company"
          autoComplete="organization"
          error={state?.fieldErrors?.company}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field
          label="Email"
          name="email"
          type="email"
          required
          autoComplete="email"
          error={state?.fieldErrors?.email}
        />
        <Field
          label="Phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          error={state?.fieldErrors?.phone}
        />
      </div>

      {showQuantity && (
        <Field
          label="Quantity (estimated)"
          name="quantity"
          type="number"
          inputMode="numeric"
          min={1}
          error={state?.fieldErrors?.quantity}
        />
      )}

      <Field
        label="Tell us what you need"
        name="message"
        as="textarea"
        rows={5}
        required
        error={state?.fieldErrors?.message}
        hint="Include products, sizes, quantities, and your delivery timeline if possible."
      />

      {state?.ok === false && state.error && (
        <p role="alert" className="text-body-sm text-red-600">
          {state.error}
        </p>
      )}

      <div className="pt-1">
        <Button type="submit" size="md" disabled={pending}>
          {pending ? "Sending…" : submitLabel}
        </Button>
      </div>

      <p className="text-caption text-[var(--fg-muted)]">
        By submitting, you agree to be contacted about your inquiry. We never share your details
        with third parties.
      </p>
    </form>
  );
}

// ---------- Field ----------

type FieldProps = {
  label: string;
  name: string;
  required?: boolean;
  error?: string[] | undefined;
  hint?: string;
} & (
  | ({
      as?: "input";
      type?: "text" | "email" | "tel" | "number";
      inputMode?: "numeric";
      min?: number;
      autoComplete?: string;
      rows?: never;
    } & Omit<
      React.InputHTMLAttributes<HTMLInputElement>,
      "type" | "name" | "required" | "min" | "autoComplete" | "inputMode"
    >)
  | ({
      as: "textarea";
      rows?: number;
      type?: never;
      inputMode?: never;
      min?: never;
      autoComplete?: never;
    } & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "name" | "required" | "rows">)
);

function Field(props: FieldProps) {
  const { label, name, required, error, hint } = props;
  const hasError = !!error?.length;

  const fieldClass = clsx(
    "mt-1 block w-full rounded-md border bg-white px-3 py-2 text-body shadow-sm transition-colors",
    "placeholder:text-[var(--fg-muted)]",
    "focus:outline-none focus:ring-1",
    hasError
      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
      : "border-[var(--border-default)] focus:border-brand-500 focus:ring-brand-500",
  );

  return (
    <label className="block">
      <span className="text-body-sm font-semibold text-[var(--fg-primary)]">
        {label}
        {required && <span className="text-red-600"> *</span>}
      </span>

      {props.as === "textarea" ? (
        <textarea
          name={name}
          rows={props.rows ?? 4}
          required={required}
          className={fieldClass}
          aria-invalid={hasError || undefined}
        />
      ) : (
        <input
          type={props.type ?? "text"}
          inputMode={props.inputMode}
          min={props.min}
          autoComplete={props.autoComplete}
          name={name}
          required={required}
          className={fieldClass}
          aria-invalid={hasError || undefined}
        />
      )}

      {hint && !hasError && (
        <span className="mt-1 block text-caption text-[var(--fg-muted)]">{hint}</span>
      )}
      {hasError && <span className="mt-1 block text-caption text-red-600">{error![0]}</span>}
    </label>
  );
}
