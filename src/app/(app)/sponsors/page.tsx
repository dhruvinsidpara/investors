"use client";

import { useMemo, useState } from "react";
import { CircleDollarSign, HandCoins, Mail, Network, Phone } from "lucide-react";
import { DistributionSummary, InvestmentDonut, summaryPresets } from "@/components/Charts";
import { DataTable, TableToolbar, useTable, type Column } from "@/components/DataTable";
import { PageHeader, Panel, SegmentedTabs, StatCard, useToast } from "@/components/ui";
import { sponsors, type Sponsor } from "@/lib/data";

const columns: Column<Sponsor>[] = [
  { key: "id", header: "Sponsor ID" },
  { key: "name", header: "Name", className: "whitespace-nowrap" },
  { key: "company", header: "Company Name" },
  { key: "recentDeal", header: "Recent Deals", className: "whitespace-nowrap" },
  { key: "email", header: "Emails" },
  { key: "phone", header: "Phone Number" },
];

export default function SponsorsPage() {
  const toast = useToast();
  const [group, setGroup] = useState<"All" | "Active Sponsor" | "Inactive Sponsors">("All");
  const rows = useMemo(
    () => (group === "All" ? sponsors : sponsors.filter((s) => (group === "Active Sponsor" ? s.active : !s.active))),
    [group],
  );
  const table = useTable(rows, columns, [
    { label: "Ace Real estate", test: (r) => r.company === "Ace Real estate" },
    { label: "Estate Brokers", test: (r) => r.company === "Estate Brokers" },
  ]);

  return (
    <>
      <PageHeader title="Sponsors" subtitle="Check list of sponsers related to your investments" />

      <div className="mb-6 grid gap-4 lg:grid-cols-[250px_1fr_1.8fr]">
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          <StatCard label="Total Sponsors" value={14} icon={HandCoins} tone="green" size="sm" className="py-4" />
          <StatCard label="Total Deals" value={14} icon={CircleDollarSign} tone="blue" size="sm" className="py-4" />
          <StatCard label="Total Distributions" value={13} icon={Network} size="sm" className="py-4" />
        </div>
        <Panel title="Total distributions per type of Investments">
          <InvestmentDonut size={140} />
        </Panel>
        <Panel title="Distribution Summary">
          <DistributionSummary
            max={25_000_000}
            rows={[
              { ...summaryPresets.actual, value: 8_000_000 },
              { ...summaryPresets.expected, value: 14_000_000 },
              { ...summaryPresets.projected, label: "Expected", value: 20_000_000 },
            ]}
          />
        </Panel>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <SegmentedTabs options={["All", "Active Sponsor", "Inactive Sponsors"] as const} value={group} onChange={setGroup} />
        <TableToolbar table={table} search={false} />
      </div>

      <DataTable
        table={table}
        rowKey={(r) => r.id + r.email}
        menu={(r) => [
          { label: "Send email", icon: Mail, onClick: () => (window.location.href = `mailto:${r.email}`) },
          { label: "Copy phone", icon: Phone, onClick: () => navigator.clipboard?.writeText(r.phone).then(() => toast("Phone number copied")) },
        ]}
      />
    </>
  );
}
