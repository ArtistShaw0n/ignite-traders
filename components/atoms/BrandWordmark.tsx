import { clsx } from "@/lib/clsx";

export type BrandWordmarkWeight = "bold" | "black";
export type BrandWordmarkSize = "sm" | "md" | "lg";

export interface BrandWordmarkProps {
  /** The brand text to render — typically a short brand name in uppercase or lowercase. */
  text: string;
  /** CSS color value (hex/rgb/var). When omitted, inherits text color. */
  color?: string;
  italic?: boolean;
  weight?: BrandWordmarkWeight;
  size?: BrandWordmarkSize;
  className?: string;
}

const sizeClass: Record<BrandWordmarkSize, string> = {
  sm: "text-lg",
  md: "text-xl",
  lg: "text-2xl",
};

const weightClass: Record<BrandWordmarkWeight, string> = {
  bold: "font-bold",
  black: "font-black",
};

/**
 * BrandWordmark — stylized brand-text placeholder used in CompanyCard's `logo`
 * variant when actual logo image assets aren't yet available. Acts as a
 * developer-facing "fake logo" — swap to real `<Image>` in production.
 */
export function BrandWordmark({
  text,
  color,
  italic = false,
  weight = "black",
  size = "md",
  className,
}: BrandWordmarkProps) {
  return (
    <span
      className={clsx(
        "tracking-tight leading-none select-none",
        sizeClass[size],
        weightClass[weight],
        italic && "italic",
        className,
      )}
      style={color ? { color } : undefined}
    >
      {text}
    </span>
  );
}
