import { clsx } from "@/lib/clsx";

export interface AboutBlockProps {
  heading: string;
  body: React.ReactNode;
  className?: string;
}

export function AboutBlock({ heading, body, className }: AboutBlockProps) {
  return (
    <article className={clsx("space-y-3", className)}>
      <h2 className="text-h3 text-[var(--fg-primary)]">{heading}</h2>
      <p className="text-body text-[var(--fg-secondary)] leading-relaxed max-w-3xl">{body}</p>
    </article>
  );
}
