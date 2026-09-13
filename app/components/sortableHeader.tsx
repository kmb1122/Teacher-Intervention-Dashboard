import type { Student } from "@/types/students";

export default function SortableHeader({
  label,
  columnKey,
  sortKey,
  sortOrder,
  onSort,
}: {
  label: string;
  columnKey: keyof Student;
  sortKey: keyof Student | null;
  sortOrder: "ascending" | "descending";
  onSort: (key: keyof Student, order: "ascending" | "descending") => void;
}) {
  const isActive = sortKey === columnKey;

  return (
    <th className="px-5 py-4 font-semibold text-white">
      <div className="relative inline-flex items-center gap-2">
        <button
          className="flex items-center gap-1"
          onClick={(e) => {
            e.stopPropagation();
            const next =
              isActive && sortOrder === "ascending"
                ? "descending"
                : "ascending";
            onSort(columnKey, next);
          }}
        >
          {label}
          <span className="text-xs">▼</span>
        </button>

        {/* Popover */}
        {isActive && (
          <div className="absolute left-0 top-8 z-10 w-32 rounded-md border border-slate-700 bg-slate-800 text-white shadow-lg">
            <button
              className="block w-full px-3 py-2 text-left hover:bg-slate-700"
              onClick={() => onSort(columnKey, "ascending")}
            >
              Ascending
            </button>
            <button
              className="block w-full px-3 py-2 text-left hover:bg-slate-700"
              onClick={() => onSort(columnKey, "descending")}
            >
              Descending
            </button>
          </div>
        )}
      </div>
    </th>
  );
}
