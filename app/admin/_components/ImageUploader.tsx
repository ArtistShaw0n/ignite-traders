"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import type { ProductImage } from "@/lib/validation/product";
import { clsx } from "@/lib/clsx";

export function ImageUploader({
  value,
  onChange,
}: {
  value: ProductImage[];
  onChange: (images: ProductImage[]) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);
    setUploading(true);
    try {
      const uploaded: ProductImage[] = [];
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/admin/upload-image", {
          method: "POST",
          body: fd,
        });
        if (!res.ok) {
          const j = (await res.json().catch(() => ({}))) as { error?: string };
          throw new Error(j.error ?? `Upload failed (${res.status})`);
        }
        const j = (await res.json()) as { url: string };
        uploaded.push({
          url: j.url,
          alt: file.name.replace(/\.[^.]+$/, ""),
        });
      }
      onChange([...value, ...uploaded]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function remove(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div>
      <span className="text-body-sm font-semibold text-[var(--fg-primary)]">Images</span>

      <div className="mt-2 flex flex-wrap gap-3">
        {value.map((img, i) => (
          <div
            key={img.url}
            className="group relative h-24 w-24 overflow-hidden rounded-md border border-[var(--border-default)] bg-[var(--bg-surface-muted)]"
          >
            <Image src={img.url} alt={img.alt ?? ""} fill className="object-cover" sizes="96px" />
            {i === 0 && (
              <span className="absolute bottom-0 left-0 right-0 bg-black/60 py-0.5 text-center text-[10px] font-semibold text-white">
                Thumbnail
              </span>
            )}
            <button
              type="button"
              onClick={() => remove(i)}
              aria-label="Remove image"
              className="absolute right-1 top-1 rounded-full bg-black/60 p-0.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
            >
              <X size={14} />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={clsx(
            "flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-md border-2 border-dashed text-caption font-medium transition-colors",
            "border-[var(--border-default)] text-[var(--fg-muted)] hover:border-brand-500 hover:text-brand-600",
            "disabled:opacity-50",
          )}
        >
          <Upload size={18} aria-hidden="true" />
          {uploading ? "Uploading…" : "Add image"}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => handleFiles(e.target.files)}
      />

      {error && <p className="mt-1.5 text-caption text-red-600">{error}</p>}
      <p className="mt-1.5 text-caption text-[var(--fg-muted)]">
        PNG / JPG / WebP, up to 4MB each. The first image is used as the card thumbnail.
      </p>
    </div>
  );
}
