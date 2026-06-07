import Image from "next/image";
import { clsx } from "@/lib/clsx";

export interface ThumbnailButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  image?: string;
  alt?: string;
  size?: "sm" | "md";
}

const sizeClass: Record<NonNullable<ThumbnailButtonProps["size"]>, string> = {
  sm: "w-16 h-16",
  md: "w-20 h-20 sm:w-24 sm:h-24",
};

export function ThumbnailButton({
  active = false,
  image,
  alt,
  size = "md",
  className,
  type = "button",
  ...rest
}: ThumbnailButtonProps) {
  return (
    <button
      type={type}
      aria-pressed={active}
      aria-label={alt ?? "Product thumbnail"}
      className={clsx(
        "relative rounded-md overflow-hidden bg-[var(--bg-surface-muted)] transition-all flex-shrink-0",
        sizeClass[size],
        active
          ? "ring-2 ring-brand-500 ring-offset-2 ring-offset-[var(--bg-page)]"
          : "ring-1 ring-[var(--border-default)] hover:ring-[var(--border-strong)]",
        className,
      )}
      {...rest}
    >
      {image ? (
        <Image src={image} alt={alt ?? ""} fill className="object-cover" sizes="96px" />
      ) : (
        <span className="absolute inset-0 flex items-center justify-center text-[var(--fg-muted)]">
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6 opacity-40"
            aria-hidden="true"
          >
            <circle cx="12" cy="8" r="3.5" />
            <rect x="6" y="13" width="12" height="9" rx="2" />
          </svg>
        </span>
      )}
    </button>
  );
}
