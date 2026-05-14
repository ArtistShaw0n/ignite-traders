import { clsx } from "@/lib/clsx";

export type BadgeColor = "bestseller" | "bulk" | "new";
export type BadgeStyle = "solid" | "soft" | "outline";
export type BadgePlacement =
  | "inline"
  | "corner-tl"
  | "corner-tr"
  | "corner-bl"
  | "corner-br";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: BadgeColor;
  variant?: BadgeStyle;
  /**
   * "inline" (default) — standard pill badge, all corners rounded.
   * "corner-*" — used inside cards; consumer must position absolutely.
   * Only the opposite corner is rounded so it visually flows into the parent's corner.
   */
  placement?: BadgePlacement;
}

const styleClass: Record<BadgeStyle, Record<BadgeColor, string>> = {
  solid: {
    bestseller: "badge-solid-bestseller",
    bulk: "badge-solid-bulk",
    new: "badge-solid-new",
  },
  soft: {
    bestseller: "badge-soft-bestseller",
    bulk: "badge-soft-bulk",
    new: "badge-soft-new",
  },
  outline: {
    bestseller: "badge-outline-bestseller",
    bulk: "badge-outline-bulk",
    new: "badge-outline-new",
  },
};

const placementClass: Record<BadgePlacement, string> = {
  inline: "",
  "corner-tl": "badge-corner-tl",
  "corner-tr": "badge-corner-tr",
  "corner-bl": "badge-corner-bl",
  "corner-br": "badge-corner-br",
};

export function Badge({
  color = "bestseller",
  variant = "solid",
  placement = "inline",
  className,
  children,
  ...rest
}: BadgeProps) {
  return (
    <span
      className={clsx(
        "badge",
        styleClass[variant][color],
        placementClass[placement],
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
