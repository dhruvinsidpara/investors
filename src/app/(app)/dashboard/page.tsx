"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { ChevronDown, FileCheck2, FileWarning, Filter, Network, MessageSquare } from "lucide-react";
import { DistributionSummary, InvestmentDonut, AmountBarChart, summaryPresets } from "@/components/Charts";
import { DataTable, useTable, type Column } from "@/components/DataTable";
import { UploadDataModal } from "@/components/Modals";
import { IconButton, PageHeader, Panel, SegmentedTabs, StatCard, StatusBadge, useClickOutside } from "@/components/ui";
import { distributions, entities, formatCurrency, investments, notifications, type Distribution, type Investment } from "@/lib/data";

const notificationIcon = {
  distribution: <Network size={16} className="text-indigo" />,
  approved: <FileCheck2 size={16} className="text-success" />,
  resubmit: <FileWarning size={16} className="text-danger" />,
  comment: <MessageSquare size={16} className="text-indigo" />,
};

const investmentColumns: Column<Investment>[] = [
  { key: "id", header: "Investment ID" },
  { key: "name", header: "Investment Name" },
  { key: "entity", header: "Entity Name" },
  { key: "date", header: "Date" },
  { key: "amount", header: "Investment", render: (r) => formatCurrency(r.amount) },
  { key: "capRate", header: "Percentage" },
  { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
];

const distributionColumns: Column<Distribution>[] = [
  { key: "id", header: "Investment ID" },
  { key: "investment", header: "Investment Name" },
  { key: "entity", header: "Entity Name" },
  { key: "date", header: "Date" },
  { key: "received", header: "Received", render: (r) => formatCurrency(r.received / 1000) },
  { key: "type", header: "Type" },
  { key: "proof", header: "Status", render: (r) => <StatusBadge status={r.proof === "Upload" ? "Pending" : r.proof} /> },
];

function UploadSplitButton({ onUpload }: { onUpload: () => void }) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const ref = useClickOutside<HTMLDivElement>(close);
  return (
    <div ref={ref} className="relative hidden sm:block">
      <div className="bg-primary-radial flex overflow-hidden rounded-full text-sm font-medium text-white">
        <button onClick={onUpload} className="px-4 py-2 hover:brightness-110">
          Upload data
        </button>
        <button onClick={() => setOpen((o) => !o)} className="border-l border-white/30 px-2.5 hover:brightness-110" aria-label="More upload options">
          <ChevronDown size={16} />
        </button>
      </div>
      {open && (
        <div className="animate-fade-in card-shadow absolute top-11 right-0 z-20 w-52 rounded-xl border border-line bg-white py-1.5 text-sm">
          <button
            className="block w-full px-4 py-2 text-left hover:bg-panel"
            onClick={() => {
              setOpen(false);
              onUpload();
            }}
          >
            Upload investment data
          </button>
          <button
            className="block w-full px-4 py-2 text-left hover:bg-panel"
            onClick={() => {
              setOpen(false);
              onUpload();
            }}
          >
            Upload distribution data
          </button>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const [group, setGroup] = useState<"Investments" | "Entities">("Investments");
  const [uploadOpen, setUploadOpen] = useState(false);
  const invTable = useTable(investments.slice(0, 4), investmentColumns);
  const distTable = useTable(distributions.slice(0, 4), distributionColumns);

  const stats =
    group === "Investments"
      ? [
          { label: "Total invested amount", value: "$23,000,000", tone: "green" as const },
          { label: "Total distribution Received", value: "$18,000,000" },
          { label: "Current Value", value: "$23,000,000" },
          { label: "Growth Rate", value: "16", extra: <span className="text-xs font-medium text-danger">-0.6%</span> },
          { label: "IRR", value: "64%" },
          { label: "Total Investments", value: investments.length, tone: "green" as const },
          { label: "Total Distributions", value: 12 },
          { label: "K1 Received", value: 8 },
          { label: "CoC", value: "43%" },
          { label: "RoR", value: "28%" },
        ]
      : [
          { label: "Total Entities", value: entities.length, tone: "green" as const },
          { label: "Active Entities", value: entities.filter((e) => e.status === "Active").length },
          { label: "Invested via Entities", value: "$14,500,000" },
          { label: "Partners", value: 18 },
          { label: "IRR", value: "58%" },
          { label: "Entity Investments", value: 22, tone: "green" as const },
          { label: "Entity Distributions", value: 9 },
          { label: "K1 Received", value: 6 },
          { label: "CoC", value: "39%" },
          { label: "RoR", value: "24%" },
        ];

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Here is a glance on your investment status" actions={<UploadSplitButton onUpload={() => setUploadOpen(true)} />} />

      <div className="mb-4 flex items-center justify-between">
        <SegmentedTabs options={["Investments", "Entities"] as const} value={group} onChange={setGroup} />
        <IconButton icon={Filter} label="Filter" className="border-none" />
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        {stats.map((s) => (
          <StatCard key={s.label} size="sm" label={s.label} value={s.value} extra={"extra" in s ? s.extra : undefined} tone={s.tone ?? "indigo"} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0 space-y-5">
          <Panel title="Distribution Summary">
            <DistributionSummary
              max={25_000_000}
              ticks={["1M", "5M", "10M", "15M", "20M", "25M"]}
              rows={[
                { ...summaryPresets.actual, value: 9_000_000 },
                { ...summaryPresets.expected, value: 19_000_000 },
                { ...summaryPresets.confirmed, value: 21_500_000, label: "Projected" },
              ]}
            />
          </Panel>

          <Panel title="Recent Investments" action={<Link href="/investments" className="text-xs font-semibold text-primary">View All</Link>}>
            <DataTable table={invTable} rowKey={(r) => r.id} />
          </Panel>

          <Panel title="Recent Distributions" action={<Link href="/distributions" className="text-xs font-semibold text-primary">View All</Link>}>
            <DataTable table={distTable} rowKey={(r) => r.id} />
          </Panel>
        </div>

        <div className="grid content-start gap-5 md:grid-cols-3 xl:grid-cols-1">
          <Panel title="Recent Notifications" action={<Link href="/notifications" className="text-xs font-semibold text-primary">View All</Link>}>
            <ul className="space-y-4">
              {notifications.slice(0, 4).map((n) => (
                <li key={n.id} className="flex gap-3 text-xs leading-snug text-ink">
                  <span className="mt-0.5">{notificationIcon[n.kind]}</span>
                  <span className="line-clamp-2">{n.text}</span>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel title="Investment Types">
            <InvestmentDonut size={140} />
          </Panel>
          <Panel title="Distributions">
            <AmountBarChart height={180} compact />
          </Panel>
        </div>
      </div>

      <UploadDataModal open={uploadOpen} onClose={() => setUploadOpen(false)} />
    </>
  );
}
