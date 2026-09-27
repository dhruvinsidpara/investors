"use client";

import { useState } from "react";
import { CircleDollarSign, Info, Network, Users } from "lucide-react";
import { DataTable, useTable, type Column } from "@/components/DataTable";
import { ReportErrorModal } from "@/components/Modals";
import { Button, PageHeader, StatCard, StatusBadge } from "@/components/ui";
import { formatCurrency, investments, type Entity, type Investment } from "@/lib/data";

const columns: Column<Investment>[] = [
  { key: "id", header: "Investment ID" },
  { key: "name", header: "Investment Name" },
  { key: "date", header: "Date" },
  { key: "amount", header: "Investment", render: (r) => formatCurrency(r.amount) },
  { key: "capRate", header: "Cap Rate" },
  { key: "irr", header: "IRR" },
  { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
];

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] text-muted">{label}</p>
      <p className="text-sm font-semibold text-ink">{value}</p>
    </div>
  );
}

export default function EntityDetail({ entity }: { entity: Entity }) {
  const [reportOpen, setReportOpen] = useState(false);
  const table = useTable(investments.slice(0, 5), columns);

  return (
    <>
      <PageHeader
        title={entity.name}
        subtitle={`${entity.id} · ${entity.address}`}
        back="/entities"
        actions={
          <Button variant="outline" className="hidden sm:inline-flex" onClick={() => setReportOpen(true)}>
            Report error
          </Button>
        }
      />

      <div className="mb-5 grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Invested" value="$14,500,000" icon={CircleDollarSign} tone="green" />
        <StatCard label="Investments" value={entity.investments.length} icon={CircleDollarSign} />
        <StatCard label="Distributions Received" value="$2,300,000" icon={Network} tone="blue" />
      </div>

      <section className="mb-5 rounded-2xl bg-panel p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <Info size={16} /> Account Information
          </h2>
          <StatusBadge status={entity.status} />
        </div>
        <div className="grid gap-4 rounded-xl bg-white p-5 sm:grid-cols-3">
          <Detail label="Mailing Address" value={entity.address} />
          <Detail label="Tax ID (EIN)" value={entity.taxId} />
          <Detail label="Investments" value={entity.investments.join(", ")} />
        </div>
      </section>

      <section className="mb-5 rounded-2xl bg-panel p-5">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
          <Users size={16} /> Partners
        </h2>
        <div className="grid gap-4 rounded-xl bg-white p-5 sm:grid-cols-3">
          {entity.partners.map((p, i) => (
            <Detail key={p} label={`Partner ${i + 1}`} value={p} />
          ))}
        </div>
      </section>

      <section className="rounded-2xl bg-panel p-5">
        <h2 className="mb-3 text-sm font-semibold">Investments</h2>
        <DataTable table={table} rowKey={(r) => r.id} />
      </section>

      <ReportErrorModal open={reportOpen} subject={entity.name} onClose={() => setReportOpen(false)} />
    </>
  );
}
