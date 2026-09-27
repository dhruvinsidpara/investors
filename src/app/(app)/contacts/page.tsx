"use client";

import { Copy, Mail } from "lucide-react";
import { DataTable, TableToolbar, useTable, type Column } from "@/components/DataTable";
import { ChipGroup, PageHeader, useToast } from "@/components/ui";
import { contacts, type Contact } from "@/lib/data";

const columns: Column<Contact>[] = [
  { key: "id", header: "Contact ID" },
  { key: "name", header: "Name", className: "whitespace-nowrap" },
  { key: "company", header: "Company Name", className: "whitespace-nowrap" },
  { key: "email", header: "Email Id" },
  { key: "designation", header: "Designation" },
  { key: "investments", header: "Associated Investments", value: (r) => r.investments.join(", "), render: (r) => <ChipGroup items={r.investments} /> },
  { key: "phone", header: "Phone Number", className: "whitespace-nowrap" },
];

export default function ContactsPage() {
  const toast = useToast();
  const table = useTable(contacts, columns, [
    { label: "Manager", test: (r) => r.designation === "Manager" },
    { label: "Director", test: (r) => r.designation === "Director" },
  ]);

  return (
    <>
      <PageHeader title="Contacts" subtitle="List of all contacts on Vestora" />
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-semibold">List of investors and their respective entities</h2>
        <TableToolbar table={table} download="contacts" />
      </div>
      <DataTable
        table={table}
        rowKey={(r) => r.id}
        menu={(r) => [
          { label: "Send email", icon: Mail, onClick: () => (window.location.href = `mailto:${r.email}`) },
          { label: "Copy email", icon: Copy, onClick: () => navigator.clipboard?.writeText(r.email).then(() => toast("Email copied")) },
        ]}
      />
    </>
  );
}
