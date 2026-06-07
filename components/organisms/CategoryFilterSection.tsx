"use client";

import { useState } from "react";
import { SectionLabel } from "@/components/atoms/SectionLabel";
import { FilterPill } from "@/components/atoms/FilterPill";
import { clsx } from "@/lib/clsx";

export interface CategoryFilterSectionProps {
  label?: string;
  title: string;
  categories: string[];
  defaultCategory?: string;
  onChange?: (category: string) => void;
  tone?: "default" | "muted";
  className?: string;
}

export function CategoryFilterSection({
  label = "Product Categories",
  title,
  categories,
  defaultCategory,
  onChange,
  tone = "default",
  className,
}: CategoryFilterSectionProps) {
  const [active, setActive] = useState(defaultCategory ?? categories[0]);

  function handleClick(cat: string) {
    setActive(cat);
    onChange?.(cat);
  }

  return (
    <section
      className={clsx(
        "section-pad-sm",
        tone === "muted" && "bg-[var(--bg-surface-muted)]",
        className,
      )}
    >
      <div className="container-site">
        <div className="text-center space-y-3">
          <SectionLabel as="p">{label}</SectionLabel>
          <h2 className="text-h2 text-[var(--fg-primary)]">{title}</h2>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <FilterPill key={cat} active={cat === active} onClick={() => handleClick(cat)}>
              {cat}
            </FilterPill>
          ))}
        </div>
      </div>
    </section>
  );
}
