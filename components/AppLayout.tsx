"use client";
import { useState } from "react";
import AppSidebar from "./AppSidebar";

export default function AppLayout({ children, bg }: { children: React.ReactNode; bg?: string }) {
  const [collapsed, setCollapsed] = useState(false);
  const pageBg = bg || "bg-[#F4F4F4]";
  const sidebarW = collapsed ? "ml-[68px]" : "ml-[200px]";

  return (
    <div className={`flex min-h-screen ${pageBg}`}>
      <AppSidebar collapsed={collapsed} onToggle={() => setCollapsed(p => !p)} />
      <main className={`flex-1 min-h-screen overflow-y-auto transition-all duration-300 ${sidebarW}`}>
        {children}
      </main>
    </div>
  );
}
