"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, FilePlus, Settings, FolderOpen, Compass, ChevronLeft, ChevronRight } from "lucide-react";

type Role = "writer" | "business" | "reader" | "subject-expert";

const NAV: Record<Role, { label: string; href: string; icon: React.ElementType }[]> = {
  writer: [
    { label: "Dashboard",    href: "/dashboard/writer",          icon: LayoutDashboard },
    { label: "Resources",    href: "/resources",                  icon: BookOpen },
    { label: "Create",       href: "/dashboard/writer/settings",  icon: FilePlus },
    { label: "Settings",     href: "/dashboard/writer/settings",  icon: Settings },
    { label: "My portfolio", href: "/portfolio",                  icon: FolderOpen },
  ],
  business: [
    { label: "Dashboard",    href: "/dashboard/business",         icon: LayoutDashboard },
    { label: "Resources",    href: "/resources",                  icon: BookOpen },
    { label: "Create",       href: "/dashboard/business/create",  icon: FilePlus },
    { label: "Settings",     href: "/dashboard/business/settings",icon: Settings },
    { label: "My portfolio", href: "/portfolio",                  icon: FolderOpen },
  ],
  reader: [
    { label: "Dashboard",    href: "/dashboard/reader",           icon: LayoutDashboard },
    { label: "Explore",      href: "/explore",                    icon: Compass },
    { label: "Settings",     href: "/dashboard/reader/settings",  icon: Settings },
    { label: "My portfolio", href: "/portfolio",                  icon: FolderOpen },
  ],
  "subject-expert": [
    { label: "Dashboard",    href: "/dashboard/subject-expert",         icon: LayoutDashboard },
    { label: "Resources",    href: "/resources",                         icon: BookOpen },
    { label: "Create",       href: "/dashboard/subject-expert/settings", icon: FilePlus },
    { label: "Settings",     href: "/dashboard/subject-expert/settings", icon: Settings },
    { label: "My portfolio", href: "/portfolio",                         icon: FolderOpen },
  ],
};

function roleFromPath(p: string): Role {
  if (p.startsWith("/dashboard/business"))      return "business";
  if (p.startsWith("/dashboard/reader"))        return "reader";
  if (p.startsWith("/dashboard/subject-expert")) return "subject-expert";
  return "writer";
}

interface Props { collapsed: boolean; onToggle: () => void; }

export default function AppSidebar({ collapsed, onToggle }: Props) {
  const pathname = usePathname();
  const role = roleFromPath(pathname);
  const items = NAV[role];
  const isActive = (href: string) => pathname === href || (href.length > 1 && pathname.startsWith(href));

  if (collapsed) {
    return (
      <aside className="fixed top-0 left-0 h-screen w-[72px] bg-[#0A0A0A] flex flex-col z-20 rounded-r-2xl transition-all duration-300">
        <div className="flex justify-center pt-7 pb-6 cursor-pointer" onClick={onToggle}>
          <span className="text-white text-xl font-black">S</span>
        </div>
        <nav className="flex flex-col gap-1 px-2 flex-1">
          {items.map(({ label, href, icon: Icon }) => (
            <Link key={label} href={href} title={label}
              className={`flex items-center justify-center py-3 rounded-xl transition-all ${
                isActive(href) ? "bg-[#1a1a1a] text-white" : "text-gray-500 hover:text-white hover:bg-white/5"
              }`}>
              <Icon size={18} strokeWidth={1.5} />
            </Link>
          ))}
        </nav>
        <button onClick={onToggle} className="flex justify-center pb-7 text-gray-500 hover:text-white cursor-pointer">
          <ChevronRight size={16} />
        </button>
      </aside>
    );
  }

  return (
    <aside className="fixed top-0 left-0 h-screen w-[200px] bg-[#0A0A0A] flex flex-col z-20 rounded-r-2xl transition-all duration-300">
      <div className="px-6 pt-7 pb-6 cursor-pointer" onClick={onToggle}>
        <span className="text-white text-lg font-bold tracking-tight underline underline-offset-2 decoration-white">
          Stick&amp;Dot.
        </span>
      </div>
      <nav className="flex flex-col gap-0.5 px-3 flex-1">
        {items.map(({ label, href, icon: Icon }) => (
          <Link key={label} href={href}
            className={`flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm font-medium transition-all ${
              isActive(href)
                ? "bg-[#1a1a1a] text-white"
                : "text-gray-500 hover:text-gray-200 hover:bg-white/5"
            }`}>
            <Icon size={17} strokeWidth={1.5} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
      <button onClick={onToggle} className="flex items-center justify-end px-5 pb-7 text-gray-600 hover:text-white transition-colors cursor-pointer">
        <ChevronLeft size={16} />
      </button>
    </aside>
  );
}
