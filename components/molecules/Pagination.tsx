"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { clsx } from "@/lib/clsx";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** Sibling pages shown on each side of current. Default 1. */
  siblingCount?: number;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  className,
}: PaginationProps) {
  const pages = buildPageList(currentPage, totalPages, siblingCount);
  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  return (
    <nav aria-label="Pagination" className={clsx("flex items-center gap-1.5", className)}>
      <PageButton
        ariaLabel="Previous page"
        disabled={!canPrev}
        onClick={() => canPrev && onPageChange(currentPage - 1)}
      >
        <ChevronLeft size={16} />
      </PageButton>

      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`gap-${i}`} aria-hidden="true" className="px-2 text-[var(--fg-muted)]">
            …
          </span>
        ) : (
          <PageButton
            key={p}
            active={p === currentPage}
            ariaLabel={`Page ${p}`}
            ariaCurrent={p === currentPage ? "page" : undefined}
            onClick={() => onPageChange(p)}
          >
            {p}
          </PageButton>
        ),
      )}

      <PageButton
        ariaLabel="Next page"
        disabled={!canNext}
        onClick={() => canNext && onPageChange(currentPage + 1)}
      >
        <ChevronRight size={16} />
      </PageButton>
    </nav>
  );
}

function PageButton({
  children,
  active = false,
  disabled = false,
  onClick,
  ariaLabel,
  ariaCurrent,
}: {
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  ariaLabel: string;
  ariaCurrent?: "page";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-current={ariaCurrent}
      className={clsx(
        "inline-flex items-center justify-center min-w-9 h-9 px-3 rounded-md text-body-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2",
        active
          ? "bg-brand-500 text-white"
          : "text-[var(--fg-secondary)] hover:bg-[var(--bg-surface-muted)] hover:text-[var(--fg-primary)]",
        disabled && "opacity-40 pointer-events-none",
      )}
    >
      {children}
    </button>
  );
}

function buildPageList(current: number, total: number, siblingCount: number): (number | "…")[] {
  // Always include first and last, current, and sibling range.
  const totalSlots = siblingCount * 2 + 5; // first + last + current + 2 ellipses + siblings
  if (total <= totalSlots) {
    return range(1, total);
  }

  const leftSibling = Math.max(current - siblingCount, 1);
  const rightSibling = Math.min(current + siblingCount, total);
  const showLeftDots = leftSibling > 2;
  const showRightDots = rightSibling < total - 1;

  if (!showLeftDots && showRightDots) {
    const leftRange = range(1, 3 + siblingCount * 2);
    return [...leftRange, "…", total];
  }
  if (showLeftDots && !showRightDots) {
    const rightRange = range(total - (3 + siblingCount * 2) + 1, total);
    return [1, "…", ...rightRange];
  }
  return [1, "…", ...range(leftSibling, rightSibling), "…", total];
}

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}
