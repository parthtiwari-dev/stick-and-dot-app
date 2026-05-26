"use client";
import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, BookOpen, Settings, FolderOpen,
  Compass, FilePlus, User, LogOut,
  ChevronLeft, ChevronRight, Users, ClipboardList,
} from "lucide-react";
import Logo from "@/components/Logo";
import {
  type DashRole,
  dashRoleFromPath,
  rawToDash,
  getStoredRole,
  clearSession,
} from "@/lib/roles";
import { createClient } from "@/lib/supabase/client";
import { hasSupabaseConfig } from "@/lib/supabase/config";

type NavItem = { label: string; href: string; icon: React.ComponentType<{ size?: number; strokeWidth?: number }> };

const NAV: Record<DashRole, NavItem[]> = {
  writer: [
    { label: "Dashboard", href: "/dashboard/writer",           icon: LayoutDashboard },
    { label: "Explore",   href: "/dashboard/writer/explore",   icon: Compass },
    { label: "Create",    href: "/dashboard/writer/create",    icon: FilePlus },
    { label: "Portfolio", href: "/dashboard/writer/portfolio", icon: FolderOpen },
    { label: "Settings",  href: "/dashboard/writer/settings",  icon: Settings },
  ],
  reader: [
    { label: "Dashboard",    href: "/dashboard/reader",               icon: LayoutDashboard },
    { label: "Explore",      href: "/explore",                        icon: Compass },
    { label: "Reading List", href: "/dashboard/reader/reading-list",  icon: BookOpen },
    { label: "Settings",     href: "/dashboard/reader/settings",      icon: Settings },
  ],
  "subject-expert": [
    { label: "Dashboard", href: "/dashboard/subject-expert",           icon: LayoutDashboard },
    { label: "Explore",   href: "/dashboard/subject-expert/explore",   icon: Compass },
    { label: "Portfolio", href: "/dashboard/subject-expert/portfolio", icon: FolderOpen },
    { label: "Settings",  href: "/dashboard/subject-expert/settings",  icon: Settings },
  ],
  business: [
    { label: "Dashboard",  href: "/dashboard/business",            icon: LayoutDashboard },
    { label: "Commission", href: "/dashboard/business/commission", icon: ClipboardList },
    { label: "Writers",    href: "/dashboard/business/writers",    icon: Users },
    { label: "Settings",   href: "/dashboard/business/settings",   icon: Settings },
  ],
};

const PROFILE_HREF: Record<DashRole, string> = {
  writer:           "/dashboard/writer/profile",
  reader:           "/dashboard/reader/profile",
  business:         "/dashboard/business/profile",
  "subject-expert": "/dashboard/subject-expert/profile",
};

interface Props { collapsed: boolean; onToggle: () => void; roleOverride?: DashRole; }

export default function AppSidebar({ collapsed, onToggle, roleOverride }: Props) {
  const pathname  = usePathname();
  const router    = useRouter();
  const fromPath = dashRoleFromPath(pathname);
  const role = roleOverride ?? fromPath ?? rawToDash(getStoredRole());

  const handleLogout = async () => {
    if (hasSupabaseConfig()) {
      await createClient().auth.signOut();
    }
    clearSession();
    router.push("/login");
  };

  const navItems    = NAV[role];
  const profileHref = PROFILE_HREF[role];

  const isActive = (href: string) =>
    pathname === href || (href.length > 1 && pathname.startsWith(href));

  const linkCls = (href: string) =>
    `flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm font-medium transition-all ${
      isActive(href) ? "bg-[#1a1a1a] text-white" : "text-gray-400 hover:text-white hover:bg-white/5"
    }`;

  if (collapsed) {
    return (
      <aside className="fixed top-0 left-0 h-screen w-[68px] bg-[#0A0A0A] flex flex-col z-20 rounded-r-2xl max-md:h-[64px] max-md:w-full max-md:flex-row max-md:items-center max-md:rounded-r-none max-md:rounded-b-2xl max-md:overflow-hidden">
        <div className="flex justify-center pt-5 pb-3 cursor-pointer max-md:pt-0 max-md:pb-0 max-md:w-14 max-md:h-full max-md:items-center" onClick={onToggle}>
          <span className="text-white text-xs font-bold tracking-tight select-none">
            S<span className="text-orange-400">.</span>
          </span>
        </div>
        <div className="no-scrollbar flex-1 overflow-y-auto px-2 flex flex-col gap-0.5 pb-4 max-md:flex-row max-md:items-center max-md:gap-1 max-md:overflow-y-hidden max-md:overflow-x-auto max-md:overscroll-x-contain max-md:pb-0 max-md:px-1">
          <p className="text-[9px] text-gray-600 font-semibold uppercase tracking-widest px-1 mb-1 max-md:hidden">Menu</p>
          {navItems.map(({ label, href, icon: Icon }) => (
            <Link key={href} href={href} title={label}
              className={`flex items-center justify-center py-3 rounded-xl transition-all touch-manipulation max-md:min-w-10 max-md:h-10 max-md:px-3 max-md:py-2 ${
                isActive(href) ? "bg-[#1a1a1a] text-white" : "text-gray-500 hover:text-white hover:bg-white/5"
              }`}>
              <Icon size={18} strokeWidth={1.5} />
            </Link>
          ))}
          <div className="my-2 border-t border-white/10 max-md:my-0 max-md:h-8 max-md:border-t-0 max-md:border-l" />
          <Link href={profileHref} title="Profile"
            className="flex items-center justify-center py-3 rounded-xl text-gray-600 hover:text-white hover:bg-white/5 transition-all touch-manipulation max-md:min-w-10 max-md:h-10 max-md:px-3 max-md:py-2">
            <User size={16} strokeWidth={1.5} />
          </Link>
          <button onClick={handleLogout} title="Log Out"
            className="flex items-center justify-center py-3 rounded-xl text-gray-600 hover:text-red-400 hover:bg-white/5 transition-all cursor-pointer touch-manipulation max-md:min-w-10 max-md:h-10 max-md:px-3 max-md:py-2">
            <LogOut size={16} strokeWidth={1.5} />
          </button>
        </div>
        <button onClick={onToggle} className="flex justify-center pb-6 text-gray-600 hover:text-white cursor-pointer max-md:hidden">
          <ChevronRight size={16} />
        </button>
      </aside>
    );
  }

  return (
    <aside className="fixed top-0 left-0 h-screen w-[200px] bg-[#0A0A0A] flex flex-col z-20 rounded-r-2xl">
      <div className="px-5 pt-7 pb-4 cursor-pointer" onClick={onToggle}>
        <Logo size="md" theme="dark" />
      </div>
      <div className="no-scrollbar flex-1 overflow-y-auto px-3 pb-4">
        <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest mb-2 px-2">Main Menu</p>
        <nav className="flex flex-col gap-0.5 mb-4">
          {navItems.map(({ label, href, icon: Icon }) => (
            <Link key={href} href={href} className={linkCls(href)}>
              <Icon size={17} strokeWidth={1.5} /><span>{label}</span>
            </Link>
          ))}
        </nav>
        <div className="border-t border-white/10 my-2" />
        <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest mb-2 px-2 mt-3">Account</p>
        <nav className="flex flex-col gap-0.5">
          <Link href={profileHref} className={linkCls(profileHref)}>
            <User size={17} strokeWidth={1.5} /><span>Profile</span>
          </Link>
          <button onClick={handleLogout}
            className="flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-white/5 transition-all cursor-pointer w-full text-left">
            <LogOut size={17} strokeWidth={1.5} /><span>Log Out</span>
          </button>
        </nav>
      </div>
      <div className="px-5 pb-2">
        <Logo size="sm" theme="dark" />
      </div>
      <button onClick={onToggle} className="flex items-center justify-end px-5 pb-5 text-gray-600 hover:text-white cursor-pointer">
        <ChevronLeft size={16} />
      </button>
    </aside>
  );
}
