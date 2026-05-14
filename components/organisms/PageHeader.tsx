import { Breadcrumb, type BreadcrumbItem } from "./Breadcrumb";
import { clsx } from "@/lib/clsx";

export interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumb?: BreadcrumbItem[];
  className?: string;
}

export function PageHeader({
  title,
  description,
  breadcrumb,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={clsx(
        "bg-[var(--bg-surface-muted)] section-pad-sm",
        className,
      )}
    >
      <div className="container-site space-y-4">
        {breadcrumb && breadcrumb.length > 0 && <Breadcrumb items={breadcrumb} />}
        <h1 className="text-h2 text-[var(--fg-primary)] tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-body-lg text-[var(--fg-secondary)] max-w-3xl leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </header>
  );
}
