"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Eye, Home } from "lucide-react";
import { DataTable, TableToolbar, useTable, type Column, type FilterOption } from "@/components/DataTable";
import { ReportErrorModal } from "@/components/Modals";
import { ChipGroup, PageHeader, StatCard, StatusBadge } from "@/components/ui";
import { entities, type Entity } from "@/lib/data";

const columns: Column<Entity>[] = [
  { key: "id", header: "Investment ID" },
  { key: "name", header: "Entity Name", className: "whitespace-nowrap" },
  { key: "investments", header: "Investments", value: (r) => r.investments.join(", "), render: (r) => <ChipGroup items={r.investments} /> },
  { key: "taxId", header: "Tax ID" },
  { key: "address", header: "Mailing Address", className: "whitespace-nowrap" },
  { key: "partners", header: "Partners", value: (r) => r.partners[0], render: (r) => <span className="whitespace-nowrap">{r.partners[0]}</span> },
  { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
];

const filters: FilterOption<Entity>[] = [
  { label: "Active", test: (r) => r.status === "Active" },
  { label: "Inactive", test: (r) => r.status === "Inactive" },
];

export default function EntitiesPage() {
  const router = useRouter();
  const [reportFor, setReportFor] = useState<string | null>(null);
  const table = useTable(entities, columns, filters);

  return (
    <>
      <PageHeader title="Entities" subtitle="Manage all your entities" />
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <StatCard label="Total Entities" value={30} icon={Home} tone="green" className="w-full sm:w-[250px]" />
        <TableToolbar table={table} search={false} />
      </div>
      <DataTable
        table={table}
        rowKey={(r) => r.id}
        onRowClick={(r) => router.push(`/entities/${r.id}`)}
        menu={(r) => [
          { label: "View details", icon: Eye, onClick: () => router.push(`/entities/${r.id}`) },
          { label: "Report error", icon: AlertTriangle, onClick: () => setReportFor(`${r.id} · ${r.name}`), danger: true },
        ]}
      />
      <ReportErrorModal open={!!reportFor} subject={reportFor ?? undefined} onClose={() => setReportFor(null)} />
    </>
  );
}
