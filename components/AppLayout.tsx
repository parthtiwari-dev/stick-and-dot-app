"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import AppSidebar from "./AppSidebar";

export default function AppLayout({ children, bg }: { children: React.ReactNode; bg?: string }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const isReader = pathname.startsWith("/dashboard/reader") || (pathname === "/explore") || (pathname === "/portfolio" && true);

  // Reader sidebar is always 220px expanded (no collapse)
  const sidebarW = isReader ? "ml-[220px]" : collapsed ? "ml-[72px]" : "ml-[200px]";
  const pageBg = bg || (isReader ? "bg-[#F4F4F4]" : "bg-[#111111]");

  return (
    <div className={`flex min-h-screen ${pageBg}`}>
      <AppSidebar collapsed={collapsed} onToggle={() => setCollapsed(p => !p)} />
      <main className={`flex-1 min-h-screen overflow-y-auto transition-all duration-300 ${sidebarW}`}>
        {children}
      </main>
    </div>
  );
}
