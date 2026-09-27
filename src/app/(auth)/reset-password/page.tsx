"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import clsx from "clsx";
import { Button, Field, inputClass } from "@/components/ui";

const rules = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One number", test: (p: string) => /\d/.test(p) },
];

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [done, setDone] = useState(false);
  const valid = rules.every((r) => r.test(password)) && password === confirm;

  if (done) {
    return (
      <div className="text-center">
        <CheckCircle2 size={52} className="mx-auto mb-4 text-success" />
        <h1 className="text-gradient text-[28px] font-bold">Password updated</h1>
        <p className="mt-2 mb-7 text-sm text-ink-2">Your password has been changed. You can now log in with your new password.</p>
        <Link href="/login">
          <Button className="w-full">Back to login</Button>
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (valid) setDone(true);
      }}
    >
      <h1 className="text-gradient text-[28px] font-bold">Set New Password</h1>
      <p className="mt-1 mb-7 text-sm text-ink-2">Choose a strong password for your account.</p>
      <div className="space-y-4">
        <Field label="New password">
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
        </Field>
        <Field label="Confirm password" error={confirm && confirm !== password ? "Passwords do not match" : undefined}>
          <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className={inputClass} />
        </Field>
      </div>
      <ul className="mt-4 space-y-1.5">
        {rules.map((r) => (
          <li key={r.label} className={clsx("flex items-center gap-2 text-xs", r.test(password) ? "text-success" : "text-muted")}>
            <CheckCircle2 size={14} /> {r.label}
          </li>
        ))}
      </ul>
      <Button type="submit" disabled={!valid} className="mt-6 w-full">
        Update password
      </Button>
    </form>
  );
}
