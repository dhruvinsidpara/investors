"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Button, Field, inputClass } from "@/components/ui";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("John.Doe@vestora.com");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Enter a valid email address";
    if (password.length < 6) next.password = "Password must be at least 6 characters";
    setErrors(next);
    if (Object.keys(next).length) return;
    setLoading(true);
    // Frontend only: no auth backend yet, so go straight to the dashboard.
    setTimeout(() => router.push("/dashboard"), 500);
  };

  return (
    <form onSubmit={submit} noValidate>
      <h1 className="text-gradient text-[28px] font-bold">Welcome Back</h1>
      <p className="mt-1 mb-7 text-sm leading-relaxed text-ink-2">Login and track your Investments, Transactions and tax details on the go.</p>

      <div className="space-y-4">
        <Field label="Email ID" error={errors.email}>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} autoComplete="email" />
        </Field>
        <Field label="Password" error={errors.password}>
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className={inputClass + " pr-10"}
              autoComplete="current-password"
            />
            <button type="button" onClick={() => setShow((s) => !s)} className="absolute top-1/2 right-3 -translate-y-1/2 text-muted" aria-label="Toggle password visibility">
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </Field>
      </div>

      <div className="mt-4 mb-6 flex items-center justify-between text-xs">
        <label className="flex cursor-pointer items-center gap-2 text-ink-2">
          <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="h-4 w-4 accent-[#4f6bde]" />
          Remember me
        </label>
        <Link href="/forgot-password" className="font-medium text-ink hover:text-primary">
          Forgot password?
        </Link>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Logging in…" : "Log In"}
      </Button>
      <p className="mt-6 text-center text-xs text-muted">
        New investor? <Link href="/welcome" className="font-medium text-primary">Accept your invite</Link>
      </p>
    </form>
  );
}
