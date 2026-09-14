import type { Student } from "@/types/students";

export type SortableColumn = keyof Student | keyof Student["grades"];

export default function SortableHeader({
  label,
  columnKey,
  sortKey,
  sortOrder,
  onSort,
}: {
  label: string;
  columnKey: SortableColumn;
  sortKey: SortableColumn | null;
  sortOrder: "ascending" | "descending";
  onSort: (key: SortableColumn, order: "ascending" | "descending") => void;
}) {
  const isActive = sortKey === columnKey;
  const nextOrder =
    isActive && sortOrder === "ascending" ? "descending" : "ascending";

  return (
    <th
      aria-sort={isActive ? sortOrder : "none"}
      className="px-5 py-4 font-semibold text-white"
    >
      <button
        type="button"
        className="flex w-full items-center gap-2 cursor-pointer text-left transition hover:text-teal-300 focus:outline-none focus-visible:text-teal-300"
        onClick={() => onSort(columnKey, nextOrder)}
      >
        <span>{label}</span>
        <span
          aria-hidden="true"
          className={`text-xs transition-transform ${isActive && sortOrder === "descending" ? "rotate-180" : ""}`}
        >
          ▼
        </span>
      </button>
    </th>
  );
}
