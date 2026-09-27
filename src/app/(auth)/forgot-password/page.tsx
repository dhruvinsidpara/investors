"use client";

import { useState } from "react";
import Link from "next/link";
import { MailCheck } from "lucide-react";
import { Button, Field, inputClass } from "@/components/ui";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  if (sent) {
    return (
      <div className="text-center">
        <MailCheck size={48} className="mx-auto mb-4 text-primary" />
        <h1 className="text-gradient text-[28px] font-bold">Check your email</h1>
        <p className="mt-2 mb-7 text-sm text-ink-2">
          We sent a password reset link to <span className="font-semibold text-ink">{email}</span>.
        </p>
        <Link href="/reset-password">
          <Button className="w-full">Open reset link</Button>
        </Link>
        <button onClick={() => setSent(false)} className="mt-4 text-xs font-medium text-primary">
          Didn&apos;t receive it? Resend
        </button>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Enter a valid email address");
        setError("");
        setSent(true);
      }}
    >
      <h1 className="text-gradient text-[28px] font-bold">Forgot Password</h1>
      <p className="mt-1 mb-7 text-sm leading-relaxed text-ink-2">Enter the email linked to your account and we&apos;ll send you a reset link.</p>
      <Field label="Email ID" error={error}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="John.Doe@vestora.com" className={inputClass} />
      </Field>
      <Button type="submit" className="mt-6 w-full">
        Send reset link
      </Button>
      <Link href="/login" className="mt-5 block text-center text-xs font-medium text-ink-2 hover:text-primary">
        ← Back to login
      </Link>
    </form>
  );
}
