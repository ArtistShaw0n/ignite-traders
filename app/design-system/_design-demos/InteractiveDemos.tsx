"use client";

import { useState } from "react";
import { Pagination } from "@/components/molecules/Pagination";
import { ThumbnailButton } from "@/components/molecules/ThumbnailButton";

export function PaginationDemo() {
  const [page, setPage] = useState(1);
  return (
    <div className="space-y-3">
      <Pagination
        currentPage={page}
        totalPages={13}
        onPageChange={setPage}
      />
      <p className="text-caption text-[var(--fg-muted)]">
        Current page: <span className="font-semibold">{page}</span> / 13
      </p>
    </div>
  );
}

export function ThumbnailGalleryDemo() {
  const [active, setActive] = useState(0);
  return (
    <div className="flex gap-3">
      {[0, 1, 2, 3].map((i) => (
        <ThumbnailButton
          key={i}
          active={i === active}
          onClick={() => setActive(i)}
          alt={`Thumbnail ${i + 1}`}
        />
      ))}
    </div>
  );
}
