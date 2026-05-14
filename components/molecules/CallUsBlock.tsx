import { Phone } from "lucide-react";
import { IconBox } from "@/components/atoms/IconBox";
import { clsx } from "@/lib/clsx";

export interface CallUsBlockProps {
  phone: string;
  label?: string;
  /** If true, renders white text on dark bg (for use inside dark sections). */
  onDark?: boolean;
  className?: string;
}

export function CallUsBlock({
  phone,
  label = "Call Us",
  onDark = false,
  className,
}: CallUsBlockProps) {
  const href = `tel:${phone.replace(/\s/g, "")}`;
  return (
    <a
      href={href}
      className={clsx(
        "inline-flex items-center gap-3 group",
        onDark
          ? "text-white"
          : "text-[var(--fg-primary)] hover:text-brand-600 dark:hover:text-brand-400",
        "transition-colors",
        className,
      )}
    >
      <IconBox
        icon={<Phone size={18} />}
        size="md"
        tone={onDark ? "neutral" : "brand"}
        className={onDark ? "bg-white/10 text-white" : ""}
      />
      <span className="flex flex-col leading-tight">
        <span
          className={clsx(
            "text-caption font-semibold uppercase tracking-wider",
            onDark ? "text-white/70" : "text-[var(--fg-muted)]",
          )}
        >
          {label}
        </span>
        <span className="text-body font-bold">{phone}</span>
      </span>
    </a>
  );
}
