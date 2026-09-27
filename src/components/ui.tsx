"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { Bell, CheckCircle2, Menu, MoreVertical, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { currentUser, notifications } from "@/lib/data";

/* ------------------------------------------------------------------ */
/* Layout context (mobile sidebar toggle)                              */
/* ------------------------------------------------------------------ */

export const LayoutContext = createContext<{ openSidebar: () => void }>({ openSidebar: () => {} });

/* ------------------------------------------------------------------ */
/* Page header                                                         */
/* ------------------------------------------------------------------ */

export function PageHeader({
  title,
  subtitle,
  back,
  actions,
}: {
  title: string;
  subtitle?: string;
  back?: string;
  actions?: ReactNode;
}) {
  const { openSidebar } = useContext(LayoutContext);
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <header className="mb-6 flex items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        <button onClick={openSidebar} className="mt-3 rounded-md p-1 text-ink-2 lg:hidden" aria-label="Open menu">
          <Menu size={22} />
        </button>
        <div>
          <div className="flex items-center gap-3">
            {back && (
              <Link href={back} className="text-primary hover:opacity-80" aria-label="Back">
                ←
              </Link>
            )}
            <h1 className="text-gradient text-[26px] leading-[1.5] font-bold sm:text-[34px]">{title}</h1>
          </div>
          {subtitle && <p className="text-sm text-ink-2 sm:text-[15px]">{subtitle}</p>}
        </div>
      </div>
      <div className="flex items-center gap-3 sm:gap-5">
        {actions}
        <Link href="/notifications" className="relative text-ink" aria-label="Notifications">
          <Bell size={20} />
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 grid h-4 w-4 place-items-center rounded-full bg-danger text-[9px] font-bold text-white">
              {unread}
            </span>
          )}
        </Link>
        <Link href="/profile" aria-label="My profile">
          <Avatar src={currentUser.avatar} size={42} />
        </Link>
      </div>
    </header>
  );
}

export function Avatar({ src, size = 40, className }: { src: string; size?: number; className?: string }) {
  return (
    <span
      className={clsx("relative block shrink-0 overflow-hidden rounded-full bg-primary-soft", className)}
      style={{ width: size, height: size }}
    >
      <Image src={src} alt="" fill sizes={`${size}px`} className="object-cover" />
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Buttons                                                             */
/* ------------------------------------------------------------------ */

export function Button({
  children,
  variant = "primary",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "outline" | "ghost" | "danger" }) {
  return (
    <button
      {...props}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" && "bg-primary-radial text-white shadow-sm hover:brightness-110",
        variant === "outline" && "border border-primary text-primary hover:bg-primary-soft",
        variant === "ghost" && "text-ink-2 hover:bg-panel",
        variant === "danger" && "bg-danger text-white hover:brightness-110",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function IconButton({
  icon: Icon,
  label,
  active,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { icon: LucideIcon; label: string; active?: boolean }) {
  return (
    <button
      {...props}
      aria-label={label}
      title={label}
      className={clsx(
        "grid h-10 w-10 place-items-center rounded-xl border bg-white transition",
        active ? "border-primary text-primary" : "border-line text-ink hover:border-primary/40",
        className,
      )}
    >
      <Icon size={18} />
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Segmented "Group By" tabs                                           */
/* ------------------------------------------------------------------ */

export function SegmentedTabs<T extends string>({
  label = "Group By",
  options,
  value,
  onChange,
}: {
  label?: string;
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      {label && <span className="text-sm text-ink-2">{label}</span>}
      <div className="flex rounded-full bg-primary-soft p-1">
        {options.map((o) => (
          <button
            key={o}
            onClick={() => onChange(o)}
            className={clsx(
              "rounded-full px-3 py-1 text-[13px] whitespace-nowrap transition",
              value === o ? "bg-primary-radial font-semibold text-white" : "text-ink-2 hover:text-primary",
            )}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Stat cards                                                          */
/* ------------------------------------------------------------------ */

const tones = {
  green: "bg-success-soft text-success",
  indigo: "bg-indigo-soft text-indigo",
  blue: "bg-primary-soft text-primary",
} as const;

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "indigo",
  size = "lg",
  extra,
  className,
}: {
  label: string;
  value: ReactNode;
  icon?: LucideIcon;
  tone?: keyof typeof tones;
  size?: "sm" | "lg";
  extra?: ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx("flex items-center gap-4 rounded-2xl px-5", size === "lg" ? "py-6" : "py-3", tones[tone], className)}>
      {Icon && <Icon size={size === "lg" ? 22 : 18} strokeWidth={1.6} className="shrink-0" />}
      <div className="min-w-0">
        <p className={clsx("truncate", size === "lg" ? "text-sm" : "text-xs", "opacity-90")}>{label}</p>
        <p className={clsx("font-bold", size === "lg" ? "text-2xl sm:text-[28px]" : "text-xl")}>
          {value} {extra}
        </p>
      </div>
    </div>
  );
}

export function Panel({ title, action, children, className }: { title?: ReactNode; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={clsx("rounded-2xl bg-panel p-5", className)}>
      {(title || action) && (
        <div className="mb-3 flex items-center justify-between gap-2">
          {title && <h3 className="text-sm font-medium text-ink">{title}</h3>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Badges & chips                                                      */
/* ------------------------------------------------------------------ */

const badgeTones: Record<string, string> = {
  Active: "bg-success-soft text-success",
  Approved: "bg-success-soft text-success",
  Inactive: "bg-danger-soft text-danger",
  Rejected: "bg-danger-soft text-danger",
  Pending: "bg-primary-soft text-primary",
  "Re-submit": "bg-indigo-soft text-indigo",
  Upload: "bg-salmon-soft text-[#d9594a]",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={clsx("inline-block rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap", badgeTones[status] ?? "bg-panel text-ink-2")}>
      {status}
    </span>
  );
}

export function ChipGroup({ items }: { items: string[] }) {
  const [first, ...rest] = items;
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap" title={items.join(", ")}>
      <span className="rounded-full bg-primary-soft px-2.5 py-1 text-xs font-semibold text-primary">{first}</span>
      {rest.length > 0 && <span className="rounded-full bg-primary-soft px-2 py-1 text-xs font-semibold text-primary">+{rest.length}</span>}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Dropdown menu (3 dots)                                              */
/* ------------------------------------------------------------------ */

export type MenuItem = { label: string; icon?: LucideIcon; onClick: () => void; danger?: boolean };

export function useClickOutside<T extends HTMLElement>(onOutside: () => void) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onOutside();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onOutside]);
  return ref;
}

export function RowMenu({ items }: { items: MenuItem[] }) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const ref = useClickOutside<HTMLDivElement>(close);
  return (
    <div ref={ref} className="relative inline-block">
      <button onClick={() => setOpen((o) => !o)} className="rounded-md p-1 text-ink hover:bg-panel" aria-label="More actions">
        <MoreVertical size={18} />
      </button>
      {open && (
        <div className="animate-fade-in card-shadow absolute top-8 right-0 z-20 min-w-[170px] rounded-xl border border-line bg-white py-1.5">
          {items.map(({ label, icon: Icon, onClick, danger }) => (
            <button
              key={label}
              onClick={() => {
                setOpen(false);
                onClick();
              }}
              className={clsx("flex w-full items-center gap-2.5 px-4 py-2 text-left text-sm hover:bg-panel", danger ? "text-danger" : "text-ink")}
            >
              {Icon && <Icon size={15} />}
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Toggle                                                              */
/* ------------------------------------------------------------------ */

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={clsx("relative h-6 w-11 rounded-full transition-colors", checked ? "bg-[#34C759]" : "bg-[#D9D9DE]")}
    >
      <span className={clsx("absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all", checked ? "left-[22px]" : "left-0.5")} />
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Modal                                                               */
/* ------------------------------------------------------------------ */

export function Modal({
  open,
  onClose,
  title,
  children,
  width = "max-w-lg",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  width?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#1F2430]/40 p-4" onMouseDown={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(e) => e.stopPropagation()}
        className={clsx("animate-fade-in w-full rounded-2xl bg-white p-6 shadow-xl", width)}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink">{title}</h2>
          <button onClick={onClose} className="rounded-md p-1 text-muted hover:bg-panel" aria-label="Close">
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Form fields                                                         */
/* ------------------------------------------------------------------ */

export function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs text-ink-2">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-danger">{error}</span>}
    </label>
  );
}

export const inputClass =
  "w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/15";

/* ------------------------------------------------------------------ */
/* Toasts                                                              */
/* ------------------------------------------------------------------ */

type Toast = { id: number; message: string };
const ToastContext = createContext<(message: string) => void>(() => {});
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = useCallback((message: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);
  return (
    <ToastContext.Provider value={push}>
      {children}
      <div className="fixed bottom-6 left-1/2 z-[60] flex -translate-x-1/2 flex-col items-center gap-2">
        {toasts.map((t) => (
          <div key={t.id} className="animate-fade-in flex items-center gap-2 rounded-full bg-[#1F2430] px-5 py-3 text-sm text-white shadow-lg">
            <CheckCircle2 size={18} className="text-[#34C759]" />
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
