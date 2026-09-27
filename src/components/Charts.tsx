"use client";

import { useState } from "react";
import { Bar, BarChart, Cell, LabelList, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCurrency, investmentTypes, monthlyDistributions } from "@/lib/data";
import { Modal } from "./ui";

/* ------------------------------------------------------------------ */
/* Distribution summary: labelled horizontal progress bars             */
/* ------------------------------------------------------------------ */

type SummaryRow = { label: string; value: number; color: string; track: string; labelColor: string };

export function DistributionSummary({
  rows,
  max,
  ticks = ["1M", "5M", "10M", "15M", "20M", "25M"],
}: {
  rows: SummaryRow[];
  max: number;
  ticks?: string[];
}) {
  return (
    <div className="space-y-3">
      {rows.map((r, i) => (
        <div key={i}>
          <div className="mb-1 flex items-center justify-between text-[13px]" style={{ color: r.labelColor }}>
            <span>{r.label}</span>
            <span className="font-medium">{formatCurrency(r.value)}</span>
          </div>
          <div className="h-5 w-full overflow-hidden rounded" style={{ background: r.track }}>
            <div className="h-full rounded transition-all duration-700" style={{ width: `${Math.min(100, (r.value / max) * 100)}%`, background: r.color }} />
          </div>
        </div>
      ))}
      <div className="flex justify-between pt-1 text-[10px] text-muted">
        {ticks.map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
    </div>
  );
}

export const summaryPresets = {
  actual: { label: "Actual", color: "linear-gradient(90deg,#5775E5,#445EBE)", track: "#E8ECFB", labelColor: "#4F6BDE" },
  expected: { label: "Expected", color: "linear-gradient(90deg,#FDA196,#F8877A)", track: "#FDE7E4", labelColor: "#F0705F" },
  projected: { label: "Projected", color: "#5A4E9C", track: "#EFEEFB", labelColor: "#5A4E9C" },
  confirmed: { label: "Confirmed", color: "#3DAA4E", track: "#E3F6E6", labelColor: "#38A14B" },
};

/* ------------------------------------------------------------------ */
/* Donut: distributions per investment type                            */
/* ------------------------------------------------------------------ */

export function InvestmentDonut({ size = 150 }: { size?: number }) {
  const [legendOpen, setLegendOpen] = useState(false);
  const total = investmentTypes.reduce((s, t) => s + t.value, 0);
  return (
    <div className="flex flex-col items-center">
      <PieChart width={size} height={size}>
        <Pie
          data={investmentTypes}
          dataKey="value"
          innerRadius={size * 0.31}
          outerRadius={size / 2 - 2}
          startAngle={90}
          endAngle={-270}
          stroke="#fff"
          strokeWidth={1}
          isAnimationActive={false}
        >
          {investmentTypes.map((t) => (
            <Cell key={t.name} fill={t.color} />
          ))}
        </Pie>
        <Tooltip formatter={(v) => [`${Math.round((Number(v) / total) * 100)}%`, ""]} contentStyle={{ borderRadius: 10, fontSize: 12 }} />
      </PieChart>
      <button onClick={() => setLegendOpen(true)} className="mt-2 self-end text-xs text-ink-2 hover:text-primary">
        View Legends
      </button>
      <Modal open={legendOpen} onClose={() => setLegendOpen(false)} title="Investment types" width="max-w-sm">
        <ul className="space-y-2.5">
          {investmentTypes.map((t) => (
            <li key={t.name} className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2.5">
                <span className="h-3 w-3 rounded-full" style={{ background: t.color }} />
                {t.name}
              </span>
              <span className="font-medium">{Math.round((t.value / total) * 100)}%</span>
            </li>
          ))}
        </ul>
      </Modal>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Monthly amount bar chart                                            */
/* ------------------------------------------------------------------ */

type BarLabelProps = { x?: number; y?: number; width?: number; height?: number; value?: string | number };

function VerticalLabel({ x = 0, y = 0, width = 0, height = 0, value }: BarLabelProps) {
  if (!value || height < 40) return null;
  x = Number(x); y = Number(y); width = Number(width); height = Number(height);
  const cx = x + width / 2;
  const cy = y + height - 8;
  return (
    <text x={cx} y={cy} transform={`rotate(-90 ${cx} ${cy})`} fill="#fff" fontSize={10} dominantBaseline="middle">
      {value}
    </text>
  );
}

export function AmountBarChart({ height = 220, compact = false }: { height?: number; compact?: boolean }) {
  const data = compact ? monthlyDistributions.slice(0, 3) : monthlyDistributions;
  return (
    <div style={{ height }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 8, right: 0, left: -18, bottom: 0 }} barCategoryGap="14%">
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#8A8F9C" }} />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: "#8A8F9C" }}
            ticks={[0, 10, 20, 30, 40, 50]}
            tickFormatter={(v) => (v === 0 ? "$100k" : `$${v}M`)}
          />
          <Tooltip cursor={{ fill: "transparent" }} formatter={(v) => [`$${v}M`, "Amount"]} contentStyle={{ borderRadius: 10, fontSize: 12 }} />
          <Bar
            dataKey="value"
            fill="#445EBE"
            radius={[2, 2, 0, 0]}
            background={{ fill: "#E8ECFB", radius: 2 }}
          >
            <LabelList dataKey="name" content={(p) => <VerticalLabel {...(p as BarLabelProps)} />} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
