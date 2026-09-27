"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Download, Eye, FileCheck2, FileClock } from "lucide-react";
import { DataTable, TableToolbar, useTable, type Column } from "@/components/DataTable";
import { ReportErrorModal } from "@/components/Modals";
import { PageHeader, StatCard, inputClass, useToast } from "@/components/ui";
import { documents, type DocumentRecord } from "@/lib/data";

const categories = ["All", "K1", "Distribution Notice", "Agreement", "Other"] as const;

export default function DocumentsPage() {
  const toast = useToast();
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [reportFor, setReportFor] = useState<string | null>(null);

  const columns: Column<DocumentRecord>[] = [
    { key: "name", header: "Document Name", className: "whitespace-nowrap" },
    { key: "property", header: "Property Name" },
    { key: "entity", header: "Entity Name" },
    { key: "investment", header: "Investment Name" },
    { key: "date", header: "Date" },
    {
      key: "download",
      header: "",
      value: () => "",
      render: (r) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            toast(`Downloading "${r.name}"`);
          }}
          className="grid h-9 w-9 place-items-center rounded-lg border border-line text-muted hover:border-primary hover:text-primary"
          aria-label={`Download ${r.name}`}
        >
          <Download size={16} />
        </button>
      ),
    },
  ];

  const rows = useMemo(() => (category === "All" ? documents : documents.filter((d) => d.category === category)), [category]);
  const table = useTable(rows, columns);

  return (
    <>
      <PageHeader title="Documents" subtitle="Cumulative documents" />
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <label className="flex items-center gap-3 text-sm text-ink-2">
          Category
          <select value={category} onChange={(e) => setCategory(e.target.value as typeof category)} className={inputClass + " w-56 sm:w-72"}>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <TableToolbar table={table} />
      </div>
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:w-2/3 xl:w-1/2">
        <StatCard label="Received K1s" value={10} icon={FileCheck2} tone="green" />
        <StatCard label="Expected K1s" value={15} icon={FileClock} />
      </div>
      <DataTable
        table={table}
        rowKey={(r) => r.id}
        menu={(r) => [
          { label: "Preview", icon: Eye, onClick: () => toast(`Opening "${r.name}"`) },
          { label: "Report error", icon: AlertTriangle, onClick: () => setReportFor(r.name), danger: true },
        ]}
      />
      <ReportErrorModal open={!!reportFor} subject={reportFor ?? undefined} onClose={() => setReportFor(null)} />
    </>
  );
}
