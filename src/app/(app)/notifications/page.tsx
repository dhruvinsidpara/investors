"use client";

import { useState } from "react";
import clsx from "clsx";
import { FileCheck2, FileWarning, MessageSquare, Network } from "lucide-react";
import { PageHeader } from "@/components/ui";
import { notifications as initial } from "@/lib/data";

const icons = {
  distribution: <Network size={18} className="text-indigo" />,
  approved: <FileCheck2 size={18} className="text-success" />,
  resubmit: <FileWarning size={18} className="text-danger" />,
  comment: <MessageSquare size={18} className="text-indigo" />,
};

export default function NotificationsPage() {
  const [items, setItems] = useState(initial);
  const unread = items.filter((n) => !n.read).length;

  return (
    <>
      <PageHeader title="Notification" subtitle="Check all your notifications" />
      <div className="mb-3 flex max-w-5xl items-center justify-between text-sm">
        <span className="text-ink-2">{unread} unread</span>
        <button onClick={() => setItems((i) => i.map((n) => ({ ...n, read: true })))} disabled={!unread} className="font-medium text-primary disabled:text-muted">
          Mark all as read
        </button>
      </div>
      <ul className="card-shadow max-w-5xl overflow-hidden rounded-xl">
        {items.map((n) => (
          <li key={n.id}>
            <button
              onClick={() => setItems((i) => i.map((x) => (x.id === n.id ? { ...x, read: true } : x)))}
              className={clsx(
                "flex w-full flex-col gap-1 border-b border-line px-5 py-4 text-left transition last:border-0 hover:bg-[#FAFBFF] sm:flex-row sm:items-center sm:justify-between",
                !n.read ? "bg-white" : "bg-white/60",
              )}
            >
              <span className="flex items-center gap-3">
                {icons[n.kind]}
                <span className={clsx("text-sm", n.read ? "text-ink-2" : "font-medium text-ink")}>{n.text}</span>
                {!n.read && <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />}
              </span>
              <span className="pl-8 text-xs whitespace-nowrap text-muted sm:pl-0">{n.date}</span>
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
