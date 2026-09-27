"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AlertTriangle, Eye } from "lucide-react";
import { DataTable, TableToolbar, useTable, type Column, type FilterOption } from "@/components/DataTable";
import { ReportErrorModal } from "@/components/Modals";
import { PageHeader, SegmentedTabs } from "@/components/ui";
import { formatCurrency, properties, type Property } from "@/lib/data";

const columns: Column<Property>[] = [
  { key: "id", header: "ID" },
  {
    key: "photo",
    header: "Photo",
    value: (r) => r.name,
    render: (r) => (
      <span className="relative block h-10 w-14 overflow-hidden rounded-md bg-primary-soft">
        <Image src={r.images[0]} alt={r.name} fill sizes="56px" className="object-cover" />
      </span>
    ),
  },
  { key: "name", header: "Name", className: "whitespace-nowrap" },
  { key: "address", header: "Address", value: (r) => `${r.address} ${r.city}`, render: (r) => <span className="block leading-snug">{r.address}<br />{r.city}</span> },
  { key: "type", header: "Type of property" },
  { key: "units", header: "Units/Square Foot" },
  { key: "builtYear", header: "Built Year" },
  { key: "loan", header: "Loan" },
  { key: "noi", header: "NOI", render: (r) => formatCurrency(r.noi) },
  { key: "sponsor", header: "Sponsor", className: "whitespace-nowrap" },
];

const filters: FilterOption<Property>[] = [
  { label: "Multi Family", test: (r) => r.type === "Multi Family" },
  { label: "Retail", test: (r) => r.type === "Retail" },
  { label: "Has loan", test: (r) => r.loan !== "Null" },
];

export default function PropertiesPage() {
  const router = useRouter();
  const [group, setGroup] = useState<"All" | "Investments" | "Entities">("All");
  const [reportFor, setReportFor] = useState<string | null>(null);
  const rows = useMemo(() => (group === "All" ? properties : properties.filter((p) => p.group === group)), [group]);
  const table = useTable(rows, columns, filters);

  return (
    <>
      <PageHeader title="Properties" subtitle="Check all your properties where you have invested" />
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <SegmentedTabs options={["All", "Investments", "Entities"] as const} value={group} onChange={setGroup} />
        <TableToolbar table={table} search={false} download="properties" />
      </div>
      <div className="card-shadow rounded-xl">
        <DataTable
          table={table}
          rowKey={(r) => r.id}
          onRowClick={(r) => router.push(`/properties/${r.id}`)}
          menu={(r) => [
            { label: "View details", icon: Eye, onClick: () => router.push(`/properties/${r.id}`) },
            { label: "Report error", icon: AlertTriangle, onClick: () => setReportFor(r.name), danger: true },
          ]}
        />
      </div>
      <ReportErrorModal open={!!reportFor} subject={reportFor ?? undefined} onClose={() => setReportFor(null)} />
    </>
  );
}
