"use client";

import { useEffect, useMemo, useState } from "react";
import { clsx } from "@/lib/clsx";

export interface CountdownTimerProps {
  /** Absolute target date for the countdown. */
  targetDate: Date | string;
  /** Visual style — "light" (orange-bg banner) or "dark" (uses surface tokens). */
  tone?: "onBrand" | "default";
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
}

function compute(target: Date): TimeLeft {
  const now = Date.now();
  const diff = Math.max(0, target.getTime() - now);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  return { days, hours, minutes };
}

export function CountdownTimer({ targetDate, tone = "onBrand", className }: CountdownTimerProps) {
  // Stabilise `target` so it doesn't trigger the effect on every render.
  const target = useMemo(
    () => (typeof targetDate === "string" ? new Date(targetDate) : targetDate),
    [targetDate],
  );
  // Render `null` segments on first paint (SSR-safe) then poll every 30s
  // for live countdown. Avoiding setState-during-render keeps server output
  // deterministic and matches client hydration.
  const [left, setLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    const tick = () => setLeft(compute(target));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, [target]);

  const segmentClasses =
    tone === "onBrand"
      ? "bg-white/15 text-white"
      : "bg-[var(--bg-surface-muted)] text-[var(--fg-primary)]";
  const labelClasses = tone === "onBrand" ? "text-white/70" : "text-[var(--fg-muted)]";

  return (
    <div
      className={clsx("flex items-stretch gap-2 sm:gap-3", className)}
      aria-label="Offer countdown"
    >
      <Segment
        value={left?.days}
        label="Days"
        segmentClasses={segmentClasses}
        labelClasses={labelClasses}
      />
      <Segment
        value={left?.hours}
        label="Hrs"
        segmentClasses={segmentClasses}
        labelClasses={labelClasses}
      />
      <Segment
        value={left?.minutes}
        label="Min"
        segmentClasses={segmentClasses}
        labelClasses={labelClasses}
      />
    </div>
  );
}

function Segment({
  value,
  label,
  segmentClasses,
  labelClasses,
}: {
  value: number | undefined;
  label: string;
  segmentClasses: string;
  labelClasses: string;
}) {
  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center rounded-md min-w-[56px] sm:min-w-[64px] px-3 py-2",
        segmentClasses,
      )}
    >
      <span className="text-h3 font-bold leading-none tabular-nums">
        {value !== undefined ? String(value).padStart(2, "0") : "--"}
      </span>
      <span
        className={clsx("text-caption font-semibold uppercase tracking-wider mt-1", labelClasses)}
      >
        {label}
      </span>
    </div>
  );
}
