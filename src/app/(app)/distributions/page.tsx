"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, CircleDollarSign, Download, MoreVertical, Network, Upload } from "lucide-react";
import { AmountBarChart, DistributionSummary, InvestmentDonut, summaryPresets } from "@/components/Charts";
import { DataTable, TableToolbar, useTable, type Column, type FilterOption } from "@/components/DataTable";
import { AddProofModal, ReportErrorModal } from "@/components/Modals";
import { Button, PageHeader, Panel, SegmentedTabs, StatCard, StatusBadge, useToast } from "@/components/ui";
import { distributionSummary, distributions, formatCurrency, type Distribution } from "@/lib/data";

const columns: Column<Distribution>[] = [
  { key: "id", header: "Investment ID" },
  { key: "investment", header: "Investment Name", className: "whitespace-nowrap" },
  { key: "entity", header: "Entity Name", className: "whitespace-nowrap" },
  { key: "date", header: "Date" },
  { key: "received", header: "Distribution Received", render: (r) => formatCurrency(r.received) },
  { key: "expected", header: "Expected Distribution", render: (r) => formatCurrency(r.expected) },
  { key: "type", header: "Type" },
  { key: "proof", header: "Proof", render: (r) => <StatusBadge status={r.proof} /> },
];

const filters: FilterOption<Distribution>[] = [
  { label: "Approved", test: (r) => r.proof === "Approved" },
  { label: "Pending", test: (r) => r.proof === "Pending" },
  { label: "Proof required", test: (r) => r.proof === "Upload" },
  { label: "Quarterly", test: (r) => r.type === "Quarterly" },
  { label: "Monthly", test: (r) => r.type === "Monthly" },
];

export default function DistributionsPage() {
  const toast = useToast();
  const [group, setGroup] = useState<"All" | "Expected Distribution" | "Late Distribution">("All");
  const [proofFor, setProofFor] = useState<string | null>(null);
  const [reportFor, setReportFor] = useState<string | null>(null);

  const rows = useMemo(() => {
    if (group === "Late Distribution") return distributions.filter((d) => d.late);
    if (group === "Expected Distribution") return distributions.filter((d) => d.received < d.expected);
    return distributions;
  }, [group]);
  const table = useTable(rows, columns, filters);
  const totalReceived = 880_000;

  return (
    <>
      <PageHeader title="Distributions" subtitle="Check your recent distributions on your investments" />

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <SegmentedTabs options={["All", "Expected Distribution", "Late Distribution"] as const} value={group} onChange={setGroup} />
        <TableToolbar table={table} search={false}>
          <Button onClick={() => setProofFor("")} className="rounded-full px-6">
            Add Proof
          </Button>
        </TableToolbar>
      </div>

      <div className="mb-6 grid gap-4 xl:grid-cols-[1fr_1fr_1.6fr]">
        <div className="grid gap-4 sm:grid-cols-2 xl:col-span-2">
          <StatCard label="Total Amount Received" value={formatCurrency(totalReceived)} icon={CircleDollarSign} tone="green" />
          <StatCard label="Total Number of Distributions received" value={distributions.filter((d) => d.proof === "Approved").length} icon={Network} />
          <Panel title="Distribution Summary">
            <DistributionSummary
              max={distributionSummary.max}
              ticks={["1M", "5M", "10M", "15M"]}
              rows={[
                { ...summaryPresets.actual, value: distributionSummary.actual },
                { ...summaryPresets.expected, value: distributionSummary.expected },
                { ...summaryPresets.projected, value: distributionSummary.projected },
              ]}
            />
          </Panel>
          <Panel title="Total distributions per type of Investments">
            <InvestmentDonut size={150} />
          </Panel>
        </div>
        <Panel title="Total Amount Graph" action={<MoreVertical size={16} className="text-muted" />}>
          <AmountBarChart height={300} />
        </Panel>
      </div>

      <DataTable
        table={table}
        rowKey={(r) => r.id}
        menu={(r) => [
          ...(r.proof !== "Approved" ? [{ label: "Upload proof", icon: Upload, onClick: () => setProofFor(r.id) }] : []),
          { label: "Download", icon: Download, onClick: () => toast(`Downloading ${r.id} distribution notice`) },
          { label: "Report error", icon: AlertTriangle, onClick: () => setReportFor(`${r.id} · ${r.investment}`), danger: true },
        ]}
      />

      <AddProofModal open={proofFor !== null} subject={proofFor || undefined} onClose={() => setProofFor(null)} />
      <ReportErrorModal open={!!reportFor} subject={reportFor ?? undefined} onClose={() => setReportFor(null)} />
    </>
  );
}
