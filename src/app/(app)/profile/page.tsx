"use client";

import { useState } from "react";
import { Building2, CircleDollarSign, Info, ListOrdered, Pencil, User, Users } from "lucide-react";
import { Avatar, Button, Field, Modal, PageHeader, StatCard, inputClass, useToast } from "@/components/ui";
import { currentUser, formatCurrency, profileEntities } from "@/lib/data";

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] text-muted">{label}</p>
      <p className="text-sm font-semibold break-words text-ink">{value}</p>
    </div>
  );
}

export default function ProfilePage() {
  const toast = useToast();
  const [user, setUser] = useState({ name: currentUser.name, email: currentUser.email, phone: currentUser.phone });
  const [editOpen, setEditOpen] = useState(false);
  const [draft, setDraft] = useState(user);
  const [pwOpen, setPwOpen] = useState(false);
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });

  const pwValid = pw.current.length > 0 && pw.next.length >= 8 && pw.next === pw.confirm;

  return (
    <>
      <PageHeader title="My Profile" subtitle="Check status of uploaded data set" />

      <div className="mb-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="flex items-center gap-4">
          <Avatar src={currentUser.avatar} size={72} className="rounded-2xl" />
          <div>
            <p className="font-semibold">{user.name}</p>
            <p className="text-sm text-muted">{currentUser.role}</p>
          </div>
        </div>
        <StatCard label="Total Money Invested" value={formatCurrency(currentUser.totalInvested)} icon={CircleDollarSign} tone="green" />
        <StatCard label="Total Investments" value={currentUser.totalInvestments} icon={ListOrdered} />
        <StatCard label="Total Properties" value={currentUser.totalProperties} icon={Building2} tone="blue" />
      </div>

      <section className="mb-5 max-w-md rounded-2xl bg-panel p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <User size={16} /> Personal Details
          </h2>
          <button
            onClick={() => {
              setDraft(user);
              setEditOpen(true);
            }}
            className="grid h-8 w-8 place-items-center rounded-full bg-white shadow-sm hover:text-primary"
            aria-label="Edit profile"
          >
            <Pencil size={14} />
          </button>
        </div>
        <div className="space-y-3">
          <Detail label="Simplee ID" value={currentUser.id} />
          <Detail label="Name" value={user.name} />
          <Detail label="Email" value={user.email} />
          <Detail label="Mobile Number" value={user.phone} />
          <div className="flex items-end gap-6">
            <Detail label="Password" value="••••••••••" />
            <button onClick={() => setPwOpen(true)} className="text-xs font-medium text-primary hover:underline">
              Change Password
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-2xl bg-panel p-5">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold">
          <User size={16} /> Entity Details
        </h2>
        {profileEntities.map((e) => (
          <div key={e.name} className="mb-6 last:mb-0">
            <h3 className="mb-3 text-sm font-semibold">{e.name}</h3>
            <div className="mb-3 rounded-xl bg-white p-5">
              <p className="mb-3 flex items-center gap-2 text-sm font-medium">
                <Info size={15} /> Account Information
              </p>
              <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
                <Detail label="Mailing Address" value={e.mailingAddress} />
                <Detail label="Tax ID (EIN)" value={e.taxId} />
                <Detail label="Investments" value={e.investments} />
              </div>
            </div>
            <div className="rounded-xl bg-white p-5">
              <p className="mb-3 flex items-center gap-2 text-sm font-medium">
                <Users size={15} /> Partners
              </p>
              <div className="flex flex-wrap gap-x-16 gap-y-3">
                {e.partners.map((p, i) => (
                  <Detail key={p} label={`Partner ${i + 1}`} value={p} />
                ))}
              </div>
            </div>
          </div>
        ))}
      </section>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Profile">
        <div className="space-y-4">
          <Field label="Name">
            <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className={inputClass} />
          </Field>
          <Field label="Email">
            <input type="email" value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} className={inputClass} />
          </Field>
          <Field label="Mobile Number">
            <input value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} className={inputClass} />
          </Field>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={!draft.name.trim() || !/^\S+@\S+\.\S+$/.test(draft.email)}
              onClick={() => {
                setUser(draft);
                setEditOpen(false);
                toast("Profile updated successfully");
              }}
            >
              Save changes
            </Button>
          </div>
        </div>
      </Modal>

      <Modal open={pwOpen} onClose={() => setPwOpen(false)} title="Change Password">
        <div className="space-y-4">
          <Field label="Current password">
            <input type="password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} className={inputClass} />
          </Field>
          <Field label="New password" error={pw.next && pw.next.length < 8 ? "At least 8 characters" : undefined}>
            <input type="password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} className={inputClass} />
          </Field>
          <Field label="Confirm new password" error={pw.confirm && pw.confirm !== pw.next ? "Passwords do not match" : undefined}>
            <input type="password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} className={inputClass} />
          </Field>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setPwOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={!pwValid}
              onClick={() => {
                setPw({ current: "", next: "", confirm: "" });
                setPwOpen(false);
                toast("Password changed successfully");
              }}
            >
              Update password
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
