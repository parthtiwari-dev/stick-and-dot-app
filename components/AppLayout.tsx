"use client";
import { useState } from "react";
import AppSidebar from "./AppSidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="flex min-h-screen bg-[#F4F4F4]">
      <AppSidebar collapsed={collapsed} onToggle={() => setCollapsed(p => !p)} />
      <main className={`flex-1 min-h-screen overflow-y-auto transition-all duration-300 ${collapsed ? "ml-[72px]" : "ml-[200px]"}`}>
        {children}
      </main>
    </div>
  );
}
