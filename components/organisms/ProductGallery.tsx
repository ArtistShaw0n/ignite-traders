"use client";

import { useState } from "react";
import Image from "next/image";
import { ThumbnailButton } from "@/components/molecules/ThumbnailButton";
import { clsx } from "@/lib/clsx";

export interface ProductGalleryImage {
  src: string;
  alt?: string;
}

export interface ProductGalleryProps {
  images?: ProductGalleryImage[];
  /** When images is empty, render a placeholder with this many thumbnails (default 4). */
  placeholderCount?: number;
  className?: string;
}

export function ProductGallery({
  images = [],
  placeholderCount = 4,
  className,
}: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const hasImages = images.length > 0;
  const thumbCount = hasImages ? images.length : placeholderCount;

  return (
    <div className={clsx("flex flex-col gap-4", className)}>
      {/* Main image */}
      <div className="relative aspect-square w-full rounded-md overflow-hidden bg-[var(--bg-surface-muted)]">
        {hasImages ? (
          <Image
            src={images[active].src}
            alt={images[active].alt ?? ""}
            fill
            className="object-contain"
            sizes="(min-width: 1024px) 50vw, 100vw"
            priority
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[var(--fg-muted)]">
            <PersonIcon />
          </div>
        )}
      </div>

      {/* Thumbnails */}
      <div className="flex gap-3 flex-wrap">
        {Array.from({ length: thumbCount }).map((_, i) => (
          <ThumbnailButton
            key={i}
            active={i === active}
            image={hasImages ? images[i].src : undefined}
            alt={hasImages ? images[i].alt : `Thumbnail ${i + 1}`}
            onClick={() => setActive(i)}
          />
        ))}
      </div>
    </div>
  );
}

function PersonIcon() {
  return (
    <svg
      viewBox="0 0 200 200"
      className="w-1/3 h-1/3 opacity-40"
      fill="currentColor"
      aria-hidden="true"
    >
      <circle cx="100" cy="60" r="32" />
      <rect x="55" y="100" width="90" height="100" rx="12" />
    </svg>
  );
}
