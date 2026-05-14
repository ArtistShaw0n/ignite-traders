import Link from "next/link";
import { clsx } from "@/lib/clsx";
import { WhatsAppIcon } from "./WhatsAppIcon";

export type ButtonVariant = "primary" | "secondary" | "whatsapp" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
};

type AsButton = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & {
    href?: undefined;
  };

type AsLink = CommonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps> & {
    href: string;
  };

export type ButtonProps = AsButton | AsLink;

const base =
  "inline-flex items-center justify-center gap-2 font-semibold rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-500 disabled:opacity-50 disabled:pointer-events-none select-none whitespace-nowrap";

const sizeClass: Record<ButtonSize, string> = {
  sm: "text-body-sm px-3.5 py-2",
  md: "text-body px-5 py-2.5",
  lg: "text-body-lg px-6 py-3.5",
};

const variantClass: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-500 text-white hover:bg-brand-600 active:bg-brand-700 shadow-button",
  secondary:
    "bg-transparent text-[var(--fg-primary)] border border-[var(--border-strong)] hover:bg-[var(--bg-surface-muted)] active:bg-[var(--bg-surface)]",
  whatsapp:
    "bg-whatsapp-500 text-white hover:bg-whatsapp-600 active:bg-whatsapp-600",
  ghost:
    "bg-transparent text-[var(--fg-primary)] hover:bg-[var(--bg-surface-muted)] active:bg-[var(--bg-surface)]",
};

export function Button(props: ButtonProps) {
  const {
    variant = "primary",
    size = "md",
    fullWidth,
    leftIcon,
    rightIcon,
    className,
    children,
    ...rest
  } = props;

  const classes = clsx(
    base,
    sizeClass[size],
    variantClass[variant],
    fullWidth && "w-full",
    className,
  );

  const inner = (
    <>
      {leftIcon ??
        (variant === "whatsapp" ? (
          <WhatsAppIcon size={whatsappIconSize(size)} />
        ) : null)}
      {children}
      {rightIcon}
    </>
  );

  if ("href" in rest && rest.href) {
    const { href, ...anchorRest } = rest as AsLink;
    return (
      <Link href={href} className={classes} {...anchorRest}>
        {inner}
      </Link>
    );
  }

  const { type = "button", ...buttonRest } = rest as AsButton;
  return (
    <button type={type} className={classes} {...buttonRest}>
      {inner}
    </button>
  );
}

/** WhatsApp brand-icon sizing — reads better a few px larger than a generic
 *  line icon, since the brand mark has more internal detail. */
function whatsappIconSize(size: ButtonSize): number {
  return size === "sm" ? 18 : size === "lg" ? 26 : 22;
}
