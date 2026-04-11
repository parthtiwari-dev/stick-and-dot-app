"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, BookOpen, Settings, FolderOpen,
  Compass, FilePlus, User, FileText, Rocket,
  ChevronLeft, ChevronRight, Grid3X3
} from "lucide-react";

type Role = "writer" | "business" | "reader" | "subject-expert";

// Path takes priority; shared pages fall back to localStorage
function roleFromPath(p: string): Role | null {
  if (p.startsWith("/dashboard/business")) return "business";
  if (p.startsWith("/dashboard/reader")) return "reader";
  if (p.startsWith("/dashboard/subject-expert")) return "subject-expert";
  if (p.startsWith("/dashboard/writer")) return "writer";
  return null; // shared page - use localStorage
}

function storageRole(): Role {
  try {
    const r = localStorage.getItem("sd_role");
    if (r === "Reader") return "reader";
    if (r === "Client") return "business";
    if (r === "Subject Expert") return "subject-expert";
    if (r === "Writer") return "writer";
  } catch (_) {}
  return "writer";
}

const NAV: Record<Role, { label: string; href: string; icon: React.ComponentType<{size?:number;strokeWidth?:number}> }[]> = {
  writer: [
    { label: "Dashboard",    href: "/dashboard/writer",          icon: LayoutDashboard },
    { label: "Resources",    href: "/resources",                  icon: BookOpen },
    { label: "Settings",     href: "/dashboard/writer/settings",  icon: Settings },
    { label: "Lorem Ipsum",  href: "/resources",                  icon: Grid3X3 },
  ],
  reader: [
    { label: "Dashboard", href: "/dashboard/reader",          icon: LayoutDashboard },
    { label: "Resources", href: "/resources",                   icon: BookOpen },
    { label: "Explore",   href: "/explore",                     icon: Compass },
    { label: "Settings",  href: "/dashboard/reader/settings",   icon: Settings },
  ],
  business: [
    { label: "Dashboard", href: "/dashboard/business",          icon: LayoutDashboard },
    { label: "Resources", href: "/resources",                    icon: BookOpen },
    { label: "Create",    href: "/dashboard/business/create",    icon: FilePlus },
    { label: "Settings",  href: "/dashboard/business/settings",  icon: Settings },
  ],
  "subject-expert": [
    { label: "Dashboard",    href: "/dashboard/subject-expert",          icon: LayoutDashboard },
    { label: "Resources",    href: "/resources",                          icon: BookOpen },
    { label: "Create",       href: "/resources",                          icon: FilePlus },
    { label: "Settings",     href: "/dashboard/subject-expert/settings",  icon: Settings },
    { label: "My Portfolio", href: "/portfolio",                          icon: FolderOpen },
  ],
};

const ACCOUNT: Record<Role, { label: string; href: string; icon: React.ComponentType<{size?:number;strokeWidth?:number}> }[]> = {
  writer:           [{ label:"Profile", href:"/dashboard/writer/settings",          icon:User  }, { label:"Sign In", href:"/login", icon:FileText }, { label:"Sign Up", href:"/signup", icon:Rocket }],
  reader:           [{ label:"Profile", href:"/dashboard/reader/settings",          icon:User  }, { label:"Sign In", href:"/login", icon:FileText }, { label:"Sign Up", href:"/signup", icon:Rocket }],
  business:         [{ label:"Profile", href:"/dashboard/business/settings",        icon:User  }, { label:"Sign In", href:"/login", icon:FileText }, { label:"Sign Up", href:"/signup", icon:Rocket }],
  "subject-expert": [{ label:"Profile", href:"/dashboard/subject-expert/settings",  icon:User  }, { label:"Sign In", href:"/login", icon:FileText }, { label:"Sign Up", href:"/signup", icon:Rocket }],
};

interface Props { collapsed: boolean; onToggle: () => void; }

export default function AppSidebar({ collapsed, onToggle }: Props) {
  const pathname = usePathname();
  const [role, setRole] = useState<Role>("writer");

  useEffect(() => {
    const fromPath = roleFromPath(pathname);
    setRole(fromPath ?? storageRole());
  }, [pathname]);

  const navItems     = NAV[role];
  const accountItems = ACCOUNT[role];

  const isActive = (href: string) =>
    pathname === href || (href.length > 1 && pathname.startsWith(href));

  const linkCls = (href: string) =>
    `flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm font-medium transition-all ${
      isActive(href) ? "bg-[#1a1a1a] text-white" : "text-gray-400 hover:text-white hover:bg-white/5"
    }`;

  if (collapsed) {
    return (
      <aside className="fixed top-0 left-0 h-screen w-[68px] bg-[#0A0A0A] flex flex-col z-20 rounded-r-2xl">
        <div className="flex justify-center pt-6 pb-4 cursor-pointer" onClick={onToggle}>
          <span className="text-white text-lg font-black">S</span>
        </div>
        <div className="flex-1 overflow-y-auto px-2 flex flex-col gap-0.5 pb-4">
          <p className="text-[9px] text-gray-600 font-semibold uppercase tracking-widest px-1 mb-1">Menu</p>
          {navItems.map(({ label, href, icon: Icon }) => (
            <Link key={`nav-${label}-${href}`} href={href} title={label}
              className={`flex items-center justify-center py-3 rounded-xl transition-all ${
                isActive(href) ? "bg-[#1a1a1a] text-white" : "text-gray-500 hover:text-white hover:bg-white/5"
              }`}>
              <Icon size={18} strokeWidth={1.5}/>
            </Link>
          ))}
          <div className="my-2 border-t border-white/10"/>
          {accountItems.map(({ label, href, icon: Icon }) => (
            <Link key={`acc-${label}`} href={href} title={label}
              className="flex items-center justify-center py-3 rounded-xl text-gray-600 hover:text-white hover:bg-white/5 transition-all">
              <Icon size={16} strokeWidth={1.5}/>
            </Link>
          ))}
        </div>
        <button onClick={onToggle} className="flex justify-center pb-6 text-gray-600 hover:text-white cursor-pointer">
          <ChevronRight size={16}/>
        </button>
      </aside>
    );
  }

  return (
    <aside className="fixed top-0 left-0 h-screen w-[200px] bg-[#0A0A0A] flex flex-col z-20 rounded-r-2xl">
      <div className="px-5 pt-7 pb-4 cursor-pointer" onClick={onToggle}>
        <span className="text-white text-base font-bold tracking-tight underline underline-offset-2">
          Stick&amp;Dot.
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-4">
        <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest mb-2 px-2">Main Menu</p>
        <nav className="flex flex-col gap-0.5 mb-4">
          {navItems.map(({ label, href, icon: Icon }) => (
            <Link key={`nav-${label}-${href}`} href={href} className={linkCls(href)}>
              <Icon size={17} strokeWidth={1.5}/><span>{label}</span>
            </Link>
          ))}
        </nav>
        <div className="border-t border-white/10 my-2"/>
        <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest mb-2 px-2 mt-3">Account Pages</p>
        <nav className="flex flex-col gap-0.5">
          {accountItems.map(({ label, href, icon: Icon }) => (
            <Link key={`acc-${label}`} href={href}
              className="flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all">
              <Icon size={17} strokeWidth={1.5}/><span>{label}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="px-5 pb-4 mt-auto">
        <p className="text-gray-600 text-sm font-bold">Logo</p>
      </div>
      <button onClick={onToggle} className="flex items-center justify-end px-5 pb-5 text-gray-600 hover:text-white cursor-pointer">
        <ChevronLeft size={16}/>
      </button>
    </aside>
  );
}
