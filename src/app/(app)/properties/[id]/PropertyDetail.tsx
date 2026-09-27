"use client";

import { useState } from "react";
import Image from "next/image";
import { AlignLeft, Building, ChevronLeft, ChevronRight, CircleDollarSign, Download, FileText, Landmark, Receipt, X } from "lucide-react";
import { DataTable, TableToolbar, useTable, type Column, type FilterOption } from "@/components/DataTable";
import { PageHeader, SegmentedTabs, StatCard, useToast } from "@/components/ui";
import { formatCurrency, noiRecords, type Property } from "@/lib/data";

type NoiRecord = (typeof noiRecords)[number];

const noiColumns: Column<NoiRecord>[] = [
  { key: "name", header: "Name" },
  { key: "amount", header: "Amount", render: (r) => formatCurrency(r.amount) },
  { key: "year", header: "Year" },
  { key: "type", header: "Type" },
  { key: "document", header: "Documents", render: (r) => <span className="text-primary">{r.document}</span> },
];

const noiFilters: FilterOption<NoiRecord>[] = [
  { label: "Actual", test: (r) => r.type === "Actual" },
  { label: "Projected", test: (r) => r.type === "Projected" },
];

function InfoGroup({ title, items }: { title: string; items: [string, string][] }) {
  return (
    <div className="mb-4 last:mb-0">
      <div className="mb-2 flex items-center gap-3">
        <span className="text-xs text-muted">{title}</span>
        <span className="h-px flex-1 bg-line" />
      </div>
      <div className="inline-flex max-w-full flex-wrap gap-x-8 gap-y-3 rounded-xl bg-white px-5 py-3">
        {items.map(([label, value]) => (
          <div key={label}>
            <p className="text-[11px] text-muted">{label}</p>
            <p className="text-sm font-semibold whitespace-pre-line text-ink">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Gallery({ images, name }: { images: string[]; name: string }) {
  const [index, setIndex] = useState<number | null>(null);
  const [main, ...rest] = images;
  return (
    <>
      <div className="grid h-full min-h-[300px] grid-cols-2 gap-3 md:grid-cols-[1.9fr_1fr_1fr] md:grid-rows-2">
        <button onClick={() => setIndex(0)} className="relative col-span-2 row-span-2 min-h-[220px] overflow-hidden rounded-xl bg-primary-soft md:col-span-1">
          <Image src={main} alt={name} fill sizes="(max-width: 768px) 100vw, 40vw" className="object-cover transition hover:scale-105" priority />
        </button>
        {rest.slice(0, 4).map((src, i) => (
          <button key={src} onClick={() => setIndex(i + 1)} className="relative min-h-[110px] overflow-hidden rounded-xl bg-primary-soft">
            <Image src={src} alt={`${name} ${i + 2}`} fill sizes="20vw" className="object-cover transition hover:scale-105" />
          </button>
        ))}
      </div>
      {index !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4" onClick={() => setIndex(null)}>
          <button className="absolute top-5 right-5 text-white" aria-label="Close">
            <X size={28} />
          </button>
          <button
            className="absolute left-4 rounded-full bg-white/15 p-2 text-white"
            aria-label="Previous"
            onClick={(e) => {
              e.stopPropagation();
              setIndex((index - 1 + images.length) % images.length);
            }}
          >
            <ChevronLeft size={26} />
          </button>
          <div className="relative h-[75vh] w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <Image src={images[index].replace(/w=\d+/, "w=1600")} alt={name} fill sizes="90vw" className="object-contain" />
          </div>
          <button
            className="absolute right-4 rounded-full bg-white/15 p-2 text-white"
            aria-label="Next"
            onClick={(e) => {
              e.stopPropagation();
              setIndex((index + 1) % images.length);
            }}
          >
            <ChevronRight size={26} />
          </button>
        </div>
      )}
    </>
  );
}

const sections = ["Overview", "Description", "Net Operating Income"] as const;

export default function PropertyDetail({ property: p }: { property: Property }) {
  const toast = useToast();
  const [tab, setTab] = useState<(typeof sections)[number]>("Overview");
  const table = useTable(noiRecords, noiColumns, noiFilters);

  const goTo = (s: (typeof sections)[number]) => {
    setTab(s);
    document.getElementById(s)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const loanRow: [string, string][] = [
    ["Occupancy", "80%"],
    ["Loan Info", "Full term"],
    ["Loan Type", "Fixed"],
    ["Outstanding Loan", formatCurrency(p.outstandingLoan)],
    ["Debt Service", formatCurrency(p.debtService)],
    ["DSCR", "$10,000"],
    ["LTV", "$10,000"],
  ];

  return (
    <>
      <PageHeader title={p.name} subtitle={`${p.address.replace(/,$/, "")}, ${p.city}`} back="/properties" />

      <div className="mb-5 grid gap-4 lg:grid-cols-[240px_1fr]">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
          <StatCard label="Estimated Value" value={formatCurrency(p.estimatedValue)} icon={CircleDollarSign} tone="green" size="sm" className="py-5" />
          <StatCard label="Outstanding Loan" value={formatCurrency(p.outstandingLoan)} icon={Receipt} size="sm" className="py-5" />
          <StatCard label="Debt Service" value={formatCurrency(p.debtService)} icon={Landmark} size="sm" className="py-5" />
          <StatCard label="Net Operating Income" value={formatCurrency(p.noi)} icon={FileText} tone="blue" size="sm" className="py-5" />
        </div>
        <Gallery images={p.images} name={p.name} />
      </div>

      <div className="sticky top-0 z-10 -mx-1 mb-4 bg-white/90 px-1 py-2 backdrop-blur">
        <SegmentedTabs label="" options={sections} value={tab} onChange={goTo} />
      </div>

      <section id="Overview" className="mb-5 scroll-mt-16 rounded-2xl bg-panel p-5">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
          <Building size={16} /> Property Overview
        </h2>
        <InfoGroup
          title="General Info"
          items={[
            ["Property ID", "NYO\n001"],
            ["Investment Name", p.name],
            ["Property Type", p.type.replace(" ", "")],
            ["Area", p.units.replace(" ", "\n")],
            ["Built in Year", String(p.builtYear)],
            ["Address", `${p.address.replace(/,/g, "").trim()}\n${p.city}`],
            ["Zip", "1132\nN"],
          ]}
        />
        <InfoGroup title="Loan Info" items={loanRow} />
        <InfoGroup title="Mortgage Info" items={loanRow} />
      </section>

      <section id="Description" className="mb-5 scroll-mt-16 rounded-2xl bg-panel p-5">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
          <AlignLeft size={16} /> Description
        </h2>
        <p className="text-sm leading-relaxed text-ink-2">
          {p.name} is a {p.units.toLowerCase()} {p.type.toLowerCase()} community built in {p.builtYear}, located in {p.city}. The property features
          renovated interiors, on-site parking, landscaped courtyards and close access to public transit and retail. The business plan focuses on
          value-add renovations, operational efficiencies and steady rent growth to deliver consistent distributions to investors over a five to
          seven year hold period.
        </p>
      </section>

      <section id="Net Operating Income" className="scroll-mt-16 rounded-2xl bg-panel p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <CircleDollarSign size={16} /> Net Operating Income
          </h2>
          <TableToolbar table={table} search={false} download={`${p.id}-noi`} />
        </div>
        <DataTable
          table={table}
          rowKey={(r) => r.document}
          menu={(r) => [{ label: "Download", icon: Download, onClick: () => toast(`Downloading ${r.document}`) }]}
        />
      </section>
    </>
  );
}
