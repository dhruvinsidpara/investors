"use client";

import { useState } from "react";
import { PageHeader, Toggle, useToast } from "@/components/ui";
import { settingsOptions } from "@/lib/data";

export default function SettingsPage() {
  const toast = useToast();
  const [prefs, setPrefs] = useState(settingsOptions);

  const update = (id: string, key: "sms" | "email", value: boolean) => {
    setPrefs((p) => p.map((o) => (o.id === id ? { ...o, [key]: value } : o)));
    toast("Preferences saved");
  };

  return (
    <>
      <PageHeader title="Settings" subtitle="Set your alerts and notifications" />
      <div className="card-shadow max-w-4xl overflow-hidden rounded-xl">
        <div className="grid grid-cols-[1fr_64px_64px] items-center gap-4 bg-[#F8F9FB] px-6 py-3 text-xs text-muted sm:grid-cols-[1fr_120px_120px]">
          <span>Notification</span>
          <span className="text-center">SMS</span>
          <span className="text-center">Email</span>
        </div>
        {prefs.map((o) => (
          <div key={o.id} className="grid grid-cols-[1fr_64px_64px] items-center gap-4 border-b border-line bg-white px-6 py-4 last:border-0 sm:grid-cols-[1fr_120px_120px]">
            <span className="text-sm text-ink">{o.label}</span>
            <span className="flex justify-center">
              <Toggle label={`${o.label} via SMS`} checked={o.sms} onChange={(v) => update(o.id, "sms", v)} />
            </span>
            <span className="flex justify-center">
              <Toggle label={`${o.label} via email`} checked={o.email} onChange={(v) => update(o.id, "email", v)} />
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
