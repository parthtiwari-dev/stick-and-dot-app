import AppSidebar from "./AppSidebar";

interface AppLayoutProps {
  children: React.ReactNode;
  sidebarCollapsed?: boolean;
}

export default function AppLayout({
  children,
  sidebarCollapsed = false,
}: AppLayoutProps) {
  const sidebarWidth = sidebarCollapsed ? "ml-[72px]" : "ml-[220px]";

  return (
    <div className="flex min-h-screen">
      <AppSidebar isCollapsed={sidebarCollapsed} />
      <main className={`flex-1 ${sidebarWidth} min-h-screen overflow-y-auto transition-all duration-300`}>
        {children}
      </main>
    </div>
  );
}
