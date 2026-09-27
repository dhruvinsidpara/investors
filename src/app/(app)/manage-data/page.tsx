"use client";

import { useMemo, useState } from "react";
import { Download, MessageSquare, RefreshCcw } from "lucide-react";
import { DataTable, TableToolbar, useTable, type Column, type FilterOption } from "@/components/DataTable";
import { UploadDataModal } from "@/components/Modals";
import { Avatar, Button, Field, Modal, PageHeader, SegmentedTabs, StatusBadge, inputClass, useToast } from "@/components/ui";
import { currentUser, dataSets, type DataSet } from "@/lib/data";

const filters: FilterOption<DataSet>[] = ["Approved", "Pending", "Re-submit", "Rejected"].map((s) => ({ label: s, test: (r) => r.status === s }));

type Comment = { author: string; text: string; time: string; admin?: boolean };

export default function ManageDataPage() {
  const toast = useToast();
  const [group, setGroup] = useState<"All" | "Investments" | "Distributions" | "Others">("All");
  const [resubmitOpen, setResubmitOpen] = useState(false);
  const [commentsFor, setCommentsFor] = useState<DataSet | null>(null);
  const [draft, setDraft] = useState("");
  const [threads, setThreads] = useState<Record<string, Comment[]>>({
    m3: [{ author: "Vestora Admin", text: "Please add the Real Estate column and resubmit the file.", time: "Feb 20, 10:45 AM", admin: true }],
    m4: [{ author: "Vestora Admin", text: "Data mapping failed for rows 12–18.", time: "Feb 19, 04:10 PM", admin: true }],
  });

  const columns: Column<DataSet>[] = [
    { key: "name", header: "Document Name", className: "min-w-[260px]" },
    { key: "uploadDate", header: "Upload Date" },
    { key: "comments", header: "Comments" },
    { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
    {
      key: "download",
      header: "",
      value: () => "",
      render: (r) => (
        <button
          onClick={() => toast(`Downloading "${r.name}"`)}
          className="grid h-9 w-9 place-items-center rounded-lg border border-line text-muted hover:border-primary hover:text-primary"
          aria-label={`Download ${r.name}`}
        >
          <Download size={16} />
        </button>
      ),
    },
  ];

  const rows = useMemo(() => (group === "All" ? dataSets : dataSets.filter((d) => d.group === group)), [group]);
  const table = useTable(rows, columns, filters);

  const sendComment = () => {
    if (!commentsFor || !draft.trim()) return;
    setThreads((t) => ({
      ...t,
      [commentsFor.id]: [...(t[commentsFor.id] ?? []), { author: currentUser.name, text: draft.trim(), time: "Just now" }],
    }));
    setDraft("");
    toast("Comment added successfully");
  };

  return (
    <>
      <PageHeader title="Manage Data" subtitle="Check status of uploaded data set" />
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <SegmentedTabs options={["All", "Investments", "Distributions", "Others"] as const} value={group} onChange={setGroup} />
        <TableToolbar table={table} />
      </div>
      <div className="card-shadow rounded-xl">
        <DataTable
          table={table}
          rowKey={(r) => r.id}
          menu={(r) => [
            { label: "Comments", icon: MessageSquare, onClick: () => setCommentsFor(r) },
            ...(r.status === "Re-submit" || r.status === "Rejected" ? [{ label: "Re-submit", icon: RefreshCcw, onClick: () => setResubmitOpen(true) }] : []),
          ]}
        />
      </div>

      <UploadDataModal open={resubmitOpen} onClose={() => setResubmitOpen(false)} />

      <Modal open={!!commentsFor} onClose={() => setCommentsFor(null)} title={`Comments · ${commentsFor?.name ?? ""}`}>
        <div className="mb-4 max-h-72 space-y-4 overflow-y-auto">
          {(commentsFor && threads[commentsFor.id]?.length ? threads[commentsFor.id] : []).map((c, i) => (
            <div key={i} className="flex gap-3">
              {c.admin ? (
                <span className="bg-primary-radial grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold text-white">V</span>
              ) : (
                <Avatar src={currentUser.avatar} size={32} />
              )}
              <div className="rounded-xl bg-panel px-3 py-2">
                <p className="text-xs font-semibold">
                  {c.author} <span className="font-normal text-muted">· {c.time}</span>
                </p>
                <p className="text-sm text-ink-2">{c.text}</p>
              </div>
            </div>
          ))}
          {commentsFor && !threads[commentsFor.id]?.length && <p className="py-6 text-center text-sm text-muted">No comments yet</p>}
        </div>
        <Field label="Add a comment">
          <textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={3} className={inputClass} placeholder="Write your comment…" />
        </Field>
        <div className="mt-4 flex justify-end">
          <Button onClick={sendComment} disabled={!draft.trim()}>
            Post comment
          </Button>
        </div>
      </Modal>
    </>
  );
}
