"use client";

import { useState } from "react";
import AppSidebar from "./AppSidebar";
import { UserProvider } from "./UserContext";

interface AppLayoutProps {
  children: React.ReactNode;
  sidebarCollapsed?: boolean;
}

export default function AppLayout({
  children,
  sidebarCollapsed: initialCollapsed = false,
}: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(initialCollapsed);
  const sidebarWidth = sidebarCollapsed ? "ml-[72px]" : "ml-[200px]";

  return (
    <UserProvider>
      <div className="flex min-h-screen">
        <AppSidebar
          isCollapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((prev) => !prev)}
        />
        <main className={`flex-1 ${sidebarWidth} min-h-screen overflow-y-auto transition-all duration-300 relative`}>
          {children}
        </main>
      </div>
    </UserProvider>
  );
}
