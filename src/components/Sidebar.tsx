"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  Building2,
  CircleDollarSign,
  Contact,
  DatabaseZap,
  FileText,
  HandCoins,
  Home,
  LayoutGrid,
  LogOut,
  Network,
  Settings,
  X,
} from "lucide-react";
import { Logo } from "./Logo";

export const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/investments", label: "Investments", icon: CircleDollarSign },
  { href: "/properties", label: "Properties", icon: Building2 },
  { href: "/distributions", label: "Distributions", icon: Network },
  { href: "/entities", label: "Entity", icon: Home },
  { href: "/sponsors", label: "Sponsors", icon: HandCoins },
  { href: "/documents", label: "Documents", icon: FileText },
  { href: "/manage-data", label: "Manage Data", icon: DatabaseZap },
  { href: "/contacts", label: "Contacts", icon: Contact },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

  return (
    <>
      {/* mobile backdrop */}
      <div
        onClick={onClose}
        className={clsx(
          "fixed inset-0 z-30 bg-black/30 transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col border-r border-line bg-white transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between px-9 pt-8 pb-8">
          <Link href="/dashboard">
            <Logo />
          </Link>
          <button onClick={onClose} className="rounded-md p-1 text-muted lg:hidden" aria-label="Close menu">
            <X size={20} />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || pathname.startsWith(href + "/");
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={onClose}
                    className={clsx(
                      "relative flex items-center gap-4 px-9 py-[15px] text-base transition-colors",
                      active ? "font-semibold text-primary" : "text-[#A3A7B1] hover:text-ink-2",
                    )}
                  >
                    <Icon size={18} strokeWidth={active ? 2.2 : 1.6} />
                    {label}
                    {active && <span className="absolute top-1/2 right-0 h-6 w-[2px] -translate-y-1/2 bg-primary" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <Link
          href="/login"
          className="mx-6 mb-6 flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-[#A3A7B1] hover:bg-panel hover:text-danger"
        >
          <LogOut size={18} /> Log out
        </Link>
      </aside>
    </>
  );
}
