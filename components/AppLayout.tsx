"use client";

import { useState } from "react";
import AppSidebar from "./AppSidebar";

export default function AppLayout({ children, sidebarCollapsed: init = false }: {
  children: React.ReactNode;
  sidebarCollapsed?: boolean;
}) {
  const [collapsed, setCollapsed] = useState(init);
  return (
    <div className="flex min-h-screen">
      <AppSidebar isCollapsed={collapsed} onToggle={() => setCollapsed((p) => !p)} />
      <main className={`flex-1 ${collapsed ? "ml-[72px]" : "ml-[200px]"} min-h-screen overflow-y-auto transition-all duration-300`}>
        {children}
      </main>
    </div>
  );
}
