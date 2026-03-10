"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Box,
  FilePlus,
  Settings,
  FolderOpen,
  Compass, 
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard",    href: "/dashboard",  icon: Home },
  { label: "Explore",      href: "/explore",    icon: Compass },
  { label: "Resources",    href: "/resources",  icon: Box },
  { label: "Create",       href: "/create",     icon: FilePlus },
  { label: "Settings",     href: "/settings",   icon: Settings },
  { label: "My portfolio", href: "/portfolio",  icon: FolderOpen },
];

interface AppSidebarProps {
  isCollapsed?: boolean;
}

export default function AppSidebar({ isCollapsed = false }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`
        fixed top-0 left-0 h-screen bg-black flex flex-col z-20 select-none
        transition-all duration-300
        ${isCollapsed ? "w-[72px]" : "w-[220px]"}
      `}
    >
      {/* Logo */}
      <div className="px-4 pt-8 pb-10 overflow-hidden">
        {isCollapsed ? (
          /* Collapsed: just a dot or monogram */
          <span className="text-white text-xl font-black flex justify-center">
            S
          </span>
        ) : (
          <span className="text-white text-xl font-bold tracking-tight whitespace-nowrap">
            Stick&amp;Dot.
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 px-2 flex-1">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const isActive =
            pathname === href || pathname.startsWith(href + "/");

          return (
            <Link
              key={href}
              href={href}
              title={isCollapsed ? label : undefined}
              className={`
                flex items-center gap-3 py-3 rounded-full text-sm font-medium
                transition-all duration-200
                ${isCollapsed ? "justify-center px-0" : "px-4"}
                ${
                  isActive
                    ? isCollapsed
                      ? "bg-white/15 text-white"
                      : "bg-white/10 text-white"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }
              `}
            >
              {/* Active glow pill behind icon when collapsed */}
              <span
                className={`
                  relative flex items-center justify-center
                  ${isCollapsed && isActive
                    ? "w-10 h-10 rounded-full bg-white/10"
                    : ""}
                `}
              >
                <Icon
                  size={18}
                  strokeWidth={1.5}
                  className={isActive ? "text-white" : "text-gray-500"}
                />
              </span>

              {/* Label — hidden when collapsed */}
              {!isCollapsed && <span className="truncate">{label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="pb-8" />
    </aside>
  );
}
