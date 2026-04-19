"use client";
import { useState, useEffect } from "react";
import AppSidebar from "./AppSidebar";

export default function AppLayout({ children, bg }: { children: React.ReactNode; bg?: string }) {
  // Start collapsed on mobile, expanded on desktop
  const [collapsed, setCollapsed] = useState(true);

  useEffect(() => {
    const check = () => setCollapsed(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const pageBg   = bg || "bg-[#F4F4F4]";
  const sidebarW = collapsed ? "ml-[68px]" : "ml-[200px]";

  return (
    <div className={`flex min-h-screen ${pageBg}`}>
      <AppSidebar collapsed={collapsed} onToggle={() => setCollapsed(p => !p)}/>
      <main className={`flex-1 min-h-screen overflow-y-auto transition-all duration-300 ${sidebarW}`}>
        {children}
      </main>
    </div>
  );
}
