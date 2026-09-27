"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Field, inputClass } from "@/components/ui";

export default function WelcomePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        router.push("/dashboard");
      }}
    >
      <h1 className="text-gradient text-[28px] font-bold">Welcome Aboard!</h1>
      <p className="mt-1 mb-7 text-sm leading-relaxed text-ink-2">
        You&apos;ve been invited to Simplee. Set up your account to start tracking your investments.
      </p>
      <div className="space-y-4">
        <Field label="Full name">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className={inputClass} />
        </Field>
        <Field label="Create password">
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
        </Field>
      </div>
      <label className="mt-4 flex cursor-pointer items-start gap-2 text-xs text-ink-2">
        <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[#4f6bde]" />
        I agree to the Terms of Service and Privacy Policy
      </label>
      <Button type="submit" disabled={!name.trim() || password.length < 8 || !agree} className="mt-6 w-full">
        Get started
      </Button>
    </form>
  );
}
