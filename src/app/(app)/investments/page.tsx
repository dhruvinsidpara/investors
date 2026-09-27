"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, CircleDollarSign, Download, Eye, Network } from "lucide-react";
import { DistributionSummary, summaryPresets } from "@/components/Charts";
import { DataTable, TableToolbar, useTable, type Column, type FilterOption } from "@/components/DataTable";
import { ReportErrorModal, UploadDataModal } from "@/components/Modals";
import { Button, ChipGroup, PageHeader, Panel, SegmentedTabs, StatCard, StatusBadge, useToast } from "@/components/ui";
import { entities, formatCurrency, investments, type Entity, type Investment } from "@/lib/data";

const columns: Column<Investment>[] = [
  { key: "id", header: "Investment ID" },
  { key: "name", header: "Investment Name" },
  { key: "entity", header: "Entity Name" },
  { key: "date", header: "Date" },
  { key: "amount", header: "Investment", render: (r) => formatCurrency(r.amount) },
  { key: "capRate", header: "Cap Rate" },
  { key: "ror", header: "RoR" },
  { key: "coc", header: "CoC" },
  { key: "irr", header: "IRR" },
  { key: "prefReturn", header: "Pref. Return" },
  { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
];

const filters: FilterOption<Investment>[] = [
  { label: "Active", test: (r) => r.status === "Active" },
  { label: "Inactive", test: (r) => r.status === "Inactive" },
];

const entityColumns: Column<Entity>[] = [
  { key: "id", header: "Entity ID" },
  { key: "name", header: "Entity Name" },
  { key: "investments", header: "Investments", value: (r) => r.investments.join(", "), render: (r) => <ChipGroup items={r.investments} /> },
  { key: "partners", header: "Partners", value: (r) => r.partners.join(", "), render: (r) => r.partners[0] },
  { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
];

export default function InvestmentsPage() {
  const router = useRouter();
  const toast = useToast();
  const [group, setGroup] = useState<"Investments" | "Entities">("Investments");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [reportFor, setReportFor] = useState<string | null>(null);
  const table = useTable(investments, columns, filters);
  const entityTable = useTable(entities, entityColumns);
  const uploadButton = (
    <Button onClick={() => setUploadOpen(true)} className="rounded-full">
      Upload data
    </Button>
  );

  return (
    <>
      <PageHeader title="My Investments" subtitle="Check your recent investment" />

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <SegmentedTabs options={["Investments", "Entities"] as const} value={group} onChange={setGroup} />
        {group === "Investments" ? (
          <TableToolbar table={table} download="investments">
            {uploadButton}
          </TableToolbar>
        ) : (
          <TableToolbar table={entityTable} download="entities">
            {uploadButton}
          </TableToolbar>
        )}
      </div>

      <div className="mb-6 grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.9fr)]">
        <div className="grid gap-4 sm:grid-cols-2 xl:col-span-2">
          <StatCard label="Total Money Invested" value="$320,000,000" icon={CircleDollarSign} tone="green" />
          <StatCard label="Total Distributions Received" value="$180,000,000" icon={Network} />
          <StatCard label="Total Investments" value={investments.length} icon={CircleDollarSign} tone="green" />
          <StatCard label="Total Distributions" value={12} icon={Network} />
        </div>
        <Panel title="Distribution Summary">
          <DistributionSummary
            max={30_000_000}
            ticks={["1M", "5M", "10M", "15M", "20M", "25M", "30M"]}
            rows={[
              { ...summaryPresets.actual, value: 12_000_000 },
              { ...summaryPresets.expected, value: 18_000_000 },
              { ...summaryPresets.projected, value: 22_000_000 },
            ]}
          />
        </Panel>
      </div>

      {group === "Investments" ? (
        <DataTable
          table={table}
          rowKey={(r) => r.id}
          menu={(r) => [
            { label: "View details", icon: Eye, onClick: () => router.push("/properties/AC01") },
            { label: "Download", icon: Download, onClick: () => toast(`Downloading ${r.id} statement`) },
            { label: "Report error", icon: AlertTriangle, onClick: () => setReportFor(`${r.id} · ${r.name}`), danger: true },
          ]}
        />
      ) : (
        <DataTable table={entityTable} rowKey={(r) => r.id} onRowClick={(r) => router.push(`/entities/${r.id}`)} />
      )}

      <UploadDataModal open={uploadOpen} onClose={() => setUploadOpen(false)} />
      <ReportErrorModal open={!!reportFor} subject={reportFor ?? undefined} onClose={() => setReportFor(null)} />
    </>
  );
}
