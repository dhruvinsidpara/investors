"use client";

import { useCallback, useMemo, useState, type ReactNode } from "react";
import clsx from "clsx";
import { ArrowDownUp, ChevronDown, ChevronUp, Download, Filter, FolderOpen, GripVertical, Search, X } from "lucide-react";
import { IconButton, RowMenu, useClickOutside, type MenuItem } from "./ui";

export type Column<T> = {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  /** value used for sorting, searching and CSV export */
  value?: (row: T) => string | number;
  className?: string;
};

type SortState = { key: string; dir: "asc" | "desc" } | null;

export type FilterOption<T> = { label: string; test: (row: T) => boolean };

/* ------------------------------------------------------------------ */
/* Hook: search / sort / filter state                                  */
/* ------------------------------------------------------------------ */

export function useTable<T>(rows: T[], columns: Column<T>[], filters: FilterOption<T>[] = []) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortState>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const getValue = useCallback(
    (row: T, col: Column<T>) => (col.value ? col.value(row) : ((row as Record<string, unknown>)[col.key] as string | number) ?? ""),
    [],
  );

  const processed = useMemo(() => {
    let out = rows;
    if (query.trim()) {
      const q = query.toLowerCase();
      out = out.filter((r) => columns.some((c) => String(getValue(r, c)).toLowerCase().includes(q)));
    }
    if (activeFilters.length) {
      const fs = filters.filter((f) => activeFilters.includes(f.label));
      out = out.filter((r) => fs.some((f) => f.test(r)));
    }
    if (sort) {
      const col = columns.find((c) => c.key === sort.key);
      if (col) {
        out = [...out].sort((a, b) => {
          const av = getValue(a, col);
          const bv = getValue(b, col);
          const cmp = typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv), undefined, { numeric: true });
          return sort.dir === "asc" ? cmp : -cmp;
        });
      }
    }
    return out;
  }, [rows, query, sort, activeFilters, filters, columns, getValue]);

  const toggleSort = (key: string) =>
    setSort((s) => (s?.key !== key ? { key, dir: "asc" } : s.dir === "asc" ? { key, dir: "desc" } : null));

  const exportCsv = (filename: string) => {
    const header = columns.map((c) => `"${c.header}"`).join(",");
    const body = processed.map((r) => columns.map((c) => `"${String(getValue(r, c)).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([header + "\n" + body], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return { rows: processed, columns, query, setQuery, sort, setSort, toggleSort, filters, activeFilters, setActiveFilters, exportCsv };
}

type TableState<T> = ReturnType<typeof useTable<T>>;

/* ------------------------------------------------------------------ */
/* Toolbar: search, download, sort, filter                             */
/* ------------------------------------------------------------------ */

export function TableToolbar<T>({
  table,
  search = true,
  download,
  children,
}: {
  table: TableState<T>;
  search?: boolean;
  /** filename for CSV export; omit to hide the download button */
  download?: string;
  children?: ReactNode;
}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menu, setMenu] = useState<"sort" | "filter" | null>(null);
  const close = useCallback(() => setMenu(null), []);
  const ref = useClickOutside<HTMLDivElement>(close);

  return (
    <div ref={ref} className="relative flex flex-wrap items-center justify-end gap-3">
      {search &&
        (searchOpen ? (
          <div className="flex h-10 items-center gap-2 rounded-xl border border-primary bg-white px-3">
            <Search size={16} className="text-muted" />
            <input
              autoFocus
              value={table.query}
              onChange={(e) => table.setQuery(e.target.value)}
              placeholder="Search…"
              className="w-40 bg-transparent text-sm outline-none sm:w-56"
            />
            <button
              onClick={() => {
                table.setQuery("");
                setSearchOpen(false);
              }}
              aria-label="Clear search"
            >
              <X size={16} className="text-muted" />
            </button>
          </div>
        ) : (
          <IconButton icon={Search} label="Search" onClick={() => setSearchOpen(true)} />
        ))}
      {download && <IconButton icon={Download} label="Download CSV" onClick={() => table.exportCsv(download)} />}
      <IconButton icon={ArrowDownUp} label="Sort" active={!!table.sort || menu === "sort"} onClick={() => setMenu(menu === "sort" ? null : "sort")} />
      {table.filters.length > 0 && (
        <IconButton
          icon={Filter}
          label="Filter"
          active={table.activeFilters.length > 0 || menu === "filter"}
          onClick={() => setMenu(menu === "filter" ? null : "filter")}
        />
      )}
      {children}

      {menu === "sort" && (
        <div className="animate-fade-in card-shadow absolute top-12 right-0 z-20 w-56 rounded-xl border border-line bg-white p-2">
          <p className="px-2 py-1.5 text-xs font-semibold text-muted uppercase">Sort by</p>
          {table.columns.filter((c) => c.header).map((c) => (
            <button
              key={c.key}
              onClick={() => table.toggleSort(c.key)}
              className={clsx("flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-sm hover:bg-panel", table.sort?.key === c.key && "text-primary")}
            >
              {c.header}
              {table.sort?.key === c.key && (table.sort.dir === "asc" ? <ChevronUp size={15} /> : <ChevronDown size={15} />)}
            </button>
          ))}
        </div>
      )}
      {menu === "filter" && (
        <div className="animate-fade-in card-shadow absolute top-12 right-0 z-20 w-56 rounded-xl border border-line bg-white p-2">
          <div className="flex items-center justify-between px-2 py-1.5">
            <p className="text-xs font-semibold text-muted uppercase">Filter</p>
            {table.activeFilters.length > 0 && (
              <button onClick={() => table.setActiveFilters([])} className="text-xs text-primary">
                Clear
              </button>
            )}
          </div>
          {table.filters.map((f) => {
            const checked = table.activeFilters.includes(f.label);
            return (
              <label key={f.label} className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-2 text-sm hover:bg-panel">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => table.setActiveFilters((a) => (checked ? a.filter((x) => x !== f.label) : [...a, f.label]))}
                  className="h-4 w-4 accent-[#4f6bde]"
                />
                {f.label}
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Table                                                               */
/* ------------------------------------------------------------------ */

export function DataTable<T>({
  table,
  rowKey,
  menu,
  onRowClick,
  empty = "No records found",
  className,
}: {
  table: TableState<T>;
  rowKey: (row: T) => string;
  menu?: (row: T) => MenuItem[];
  onRowClick?: (row: T) => void;
  empty?: string;
  className?: string;
}) {
  const { rows, columns, sort, toggleSort } = table;
  return (
    <div className={clsx("scrollbar-thin overflow-x-auto rounded-xl", className)}>
      <table className="w-full min-w-[860px] border-collapse text-sm">
        <thead>
          <tr className="bg-[#F8F9FB] text-left text-xs text-muted">
            {columns.map((c) => (
              <th key={c.key} className="px-4 py-3 font-normal whitespace-nowrap first:pl-6">
                {c.header && (
                <button onClick={() => toggleSort(c.key)} className="inline-flex items-center gap-1 hover:text-ink">
                  <GripVertical size={12} className="text-primary/60" />
                  {c.header}
                  {sort?.key === c.key && (sort.dir === "asc" ? <ChevronUp size={13} /> : <ChevronDown size={13} />)}
                </button>
                )}
              </th>
            ))}
            {menu && <th className="w-12" />}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={rowKey(row)}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={clsx("border-b border-line bg-white transition-colors hover:bg-[#FAFBFF]", onRowClick && "cursor-pointer")}
            >
              {columns.map((c) => (
                <td key={c.key} className={clsx("px-4 py-4 text-ink first:pl-6", c.className)}>
                  {c.render ? c.render(row) : String((row as Record<string, unknown>)[c.key] ?? "")}
                </td>
              ))}
              {menu && (
                <td className="pr-4 text-right" onClick={(e) => e.stopPropagation()}>
                  <RowMenu items={menu(row)} />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-14 text-muted">
          <FolderOpen size={40} strokeWidth={1.2} />
          <p className="text-sm font-medium text-ink-2">{empty}</p>
        </div>
      )}
    </div>
  );
}
