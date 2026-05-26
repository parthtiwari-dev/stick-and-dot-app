"use client";
import { useState, useEffect } from "react";
import AppSidebar from "./AppSidebar";
import type { DashRole } from "@/lib/roles";

export default function AppLayout({
  children,
  bg,
  role,
}: {
  children: React.ReactNode;
  bg?: string;
  role?: DashRole;
}) {
  // Start collapsed on mobile, expanded on desktop
  const [collapsed, setCollapsed] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setCollapsed(mobile);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const pageBg   = bg || "bg-[#F4F4F4]";
  const sidebarW = collapsed ? "ml-[68px] max-md:ml-0 max-md:pt-[64px]" : "ml-[200px]";

  return (
    <div className={`flex min-h-screen ${pageBg}`}>
      <AppSidebar collapsed={collapsed} onToggle={() => { if (!isMobile) setCollapsed(p => !p); }} roleOverride={role}/>
      <main className={`flex-1 min-w-0 min-h-screen overflow-y-auto transition-all duration-300 ${sidebarW}`}>
        {children}
      </main>
    </div>
  );
}
