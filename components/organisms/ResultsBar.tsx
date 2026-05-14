import { Dropdown, type DropdownOption } from "@/components/atoms/Dropdown";
import { clsx } from "@/lib/clsx";

export interface ResultsBarProps {
  shown: number;
  total: number;
  sortOptions?: DropdownOption[];
  sortValue?: string;
  defaultSort?: string;
  onSortChange?: (value: string) => void;
  className?: string;
}

const DEFAULT_SORT: DropdownOption[] = [
  { label: "Most popular", value: "popular" },
  { label: "Newest first", value: "newest" },
  { label: "Name: A → Z", value: "name-asc" },
];

export function ResultsBar({
  shown,
  total,
  sortOptions = DEFAULT_SORT,
  sortValue,
  defaultSort = "popular",
  onSortChange,
  className,
}: ResultsBarProps) {
  return (
    <div
      className={clsx(
        "flex items-center justify-between gap-4 flex-wrap py-4",
        className,
      )}
    >
      <p className="text-body-sm text-[var(--fg-secondary)]">
        Showing{" "}
        <span className="font-semibold text-[var(--fg-primary)]">{shown}</span>{" "}
        of{" "}
        <span className="font-semibold text-[var(--fg-primary)]">{total}</span>{" "}
        products
      </p>
      <Dropdown
        label="Sort"
        options={sortOptions}
        value={sortValue}
        defaultValue={defaultSort}
        onChange={onSortChange}
      />
    </div>
  );
}
