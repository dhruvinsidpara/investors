"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { LayoutContext, ToastProvider } from "@/components/ui";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <ToastProvider>
      <LayoutContext.Provider value={{ openSidebar: () => setOpen(true) }}>
        <Sidebar open={open} onClose={() => setOpen(false)} />
        <main className="min-h-screen min-w-0 overflow-x-clip px-4 pt-6 pb-10 sm:px-6 lg:ml-[260px] lg:pt-8 lg:pr-7 lg:pl-6">{children}</main>
      </LayoutContext.Provider>
    </ToastProvider>
  );
}
