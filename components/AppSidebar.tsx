"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, FilePlus, Settings, FolderOpen, Compass, Search, DollarSign, ChevronLeft, ChevronRight, FileText } from "lucide-react";

type Role = "writer" | "business" | "reader" | "subject-expert";

function roleFromPath(p: string): Role {
  if (p.startsWith("/dashboard/business")) return "business";
  if (p.startsWith("/dashboard/reader"))   return "reader";
  if (p.startsWith("/dashboard/subject-expert")) return "subject-expert";
  return "writer";
}

const NAV_WRITER = [
  { label: "Dashboard",    href: "/dashboard/writer",          icon: LayoutDashboard },
  { label: "Resources",    href: "/resources",                  icon: BookOpen },
  { label: "Create",       href: "/dashboard/writer/settings",  icon: FilePlus },
  { label: "Settings",     href: "/dashboard/writer/settings",  icon: Settings },
  { label: "My portfolio", href: "/portfolio",                  icon: FolderOpen },
];
const NAV_BUSINESS = [
  { label: "Dashboard",    href: "/dashboard/business",          icon: LayoutDashboard },
  { label: "Resources",    href: "/resources",                   icon: BookOpen },
  { label: "Create",       href: "/dashboard/business/create",   icon: FilePlus },
  { label: "Settings",     href: "/dashboard/business/settings", icon: Settings },
  { label: "Lorem Ipsum",  href: "/resources",                   icon: FolderOpen },
];
const NAV_BUSINESS_ACCOUNT = [
  { label: "Profile",  href: "/dashboard/business/settings", icon: LayoutDashboard },
  { label: "Sign In",  href: "/login",                        icon: FileText },
  { label: "Sign Up",  href: "/signup",                       icon: Search },
];
const NAV_READER = [
  { label: "Dashboard",    href: "/dashboard/reader",          icon: LayoutDashboard },
  { label: "Resources",    href: "/resources",                  icon: BookOpen },
  { label: "Explore",      href: "/explore",                    icon: Compass },
  { label: "Settings",     href: "/dashboard/reader/settings",  icon: Settings },
  { label: "Leads",        href: "/leads",                      icon: DollarSign },
];
const NAV_READER_FAVES = [
  { label: "Article 1", href: "/articles/1", icon: FileText },
  { label: "Article 1", href: "/articles/2", icon: FileText },
  { label: "Article 1", href: "/articles/3", icon: FileText },
];
const NAV_EXPERT = [
  { label: "Dashboard",    href: "/dashboard/subject-expert",          icon: LayoutDashboard },
  { label: "Resources",    href: "/resources",                          icon: BookOpen },
  { label: "Create",       href: "/dashboard/subject-expert/settings",  icon: FilePlus },
  { label: "Settings",     href: "/dashboard/subject-expert/settings",  icon: Settings },
  { label: "My portfolio", href: "/portfolio",                          icon: FolderOpen },
];

interface Props { collapsed: boolean; onToggle: () => void; }

export default function AppSidebar({ collapsed, onToggle }: Props) {
  const pathname = usePathname();
  const role = roleFromPath(pathname);

  const isActive = (href: string) =>
    pathname === href || (href.length > 1 && pathname.startsWith(href + "/"));

  const linkBase = (href: string) =>
    `flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm font-medium transition-all ${
      isActive(href) ? "bg-[#1a1a1a] text-white" : "text-gray-400 hover:text-white hover:bg-white/5"
    }`;

  /* ── READER: always expanded, white sidebar ── */
  if (role === "reader") {
    return (
      <aside className="fixed top-0 left-0 h-screen w-[220px] bg-white border-r border-gray-100 flex flex-col z-20 shadow-sm">
        <div className="px-6 pt-7 pb-4">
          <span className="text-gray-900 text-lg font-bold tracking-tight underline underline-offset-2">Stick&amp;Dot.</span>
        </div>
        <div className="flex-1 overflow-y-auto px-3">
          <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest mb-2 px-2 mt-2">Main Menu</p>
          <nav className="flex flex-col gap-0.5 mb-5">
            {NAV_READER.map(({ label, href, icon: Icon }) => (
              <Link key={label} href={href}
                className={`flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm font-medium transition-all ${
                  isActive(href) ? "bg-gray-900 text-white" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}>
                <Icon size={17} strokeWidth={1.5} /><span>{label}</span>
              </Link>
            ))}
          </nav>
          <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest mb-2 px-2">Favourite</p>
          <nav className="flex flex-col gap-0.5">
            {NAV_READER_FAVES.map(({ label, href, icon: Icon }, i) => (
              <Link key={i} href={href}
                className="flex items-center gap-3 py-2 px-3 rounded-xl text-sm text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-all">
                <Icon size={15} strokeWidth={1.5} /><span>{label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </aside>
    );
  }

  /* ── BUSINESS: expanded with MAIN MENU / ACCOUNT PAGES sections ── */
  if (role === "business") {
    if (collapsed) {
      return (
        <aside className="fixed top-0 left-0 h-screen w-[72px] bg-[#0A0A0A] flex flex-col z-20 rounded-r-2xl">
          <div className="flex justify-center pt-7 pb-6 cursor-pointer" onClick={onToggle}>
            <span className="text-white text-xl font-black">S</span>
          </div>
          <nav className="flex flex-col gap-1 px-2 flex-1">
            {NAV_BUSINESS.map(({ label, href, icon: Icon }) => (
              <Link key={label} href={href} title={label}
                className={`flex items-center justify-center py-3 rounded-xl transition-all ${
                  isActive(href) ? "bg-[#1a1a1a] text-white" : "text-gray-500 hover:text-white hover:bg-white/5"
                }`}>
                <Icon size={18} strokeWidth={1.5} />
              </Link>
            ))}
          </nav>
          <button onClick={onToggle} className="flex justify-center pb-7 text-gray-600 hover:text-white cursor-pointer">
            <ChevronRight size={16} />
          </button>
        </aside>
      );
    }
    return (
      <aside className="fixed top-0 left-0 h-screen w-[200px] bg-[#0A0A0A] flex flex-col z-20 rounded-r-2xl">
        <div className="px-5 pt-7 pb-5 cursor-pointer" onClick={onToggle}>
          <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest mb-2">MAIN MENU</p>
        </div>
        <nav className="flex flex-col gap-0.5 px-3">
          {NAV_BUSINESS.map(({ label, href, icon: Icon }) => (
            <Link key={label} href={href} className={linkBase(href)}>
              <Icon size={17} strokeWidth={1.5} /><span>{label}</span>
            </Link>
          ))}
        </nav>
        <div className="px-5 pt-5 pb-2">
          <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest">ACCOUNT PAGES</p>
        </div>
        <nav className="flex flex-col gap-0.5 px-3 flex-1">
          {NAV_BUSINESS_ACCOUNT.map(({ label, href, icon: Icon }) => (
            <Link key={label} href={href} className={linkBase(href)}>
              <Icon size={17} strokeWidth={1.5} /><span>{label}</span>
            </Link>
          ))}
        </nav>
        <button onClick={onToggle} className="flex items-center justify-end px-5 pb-7 text-gray-600 hover:text-white cursor-pointer">
          <ChevronLeft size={16} />
        </button>
      </aside>
    );
  }

  /* ── WRITER / SUBJECT-EXPERT: dark collapsed/expanded ── */
  const items = role === "subject-expert" ? NAV_EXPERT : NAV_WRITER;

  if (collapsed) {
    return (
      <aside className="fixed top-0 left-0 h-screen w-[72px] bg-[#0A0A0A] flex flex-col z-20 rounded-r-2xl">
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
        <button onClick={onToggle} className="flex justify-center pb-7 text-gray-600 hover:text-white cursor-pointer">
          <ChevronRight size={16} />
        </button>
      </aside>
    );
  }

  return (
    <aside className="fixed top-0 left-0 h-screen w-[200px] bg-[#0A0A0A] flex flex-col z-20 rounded-r-2xl">
      <div className="px-6 pt-7 pb-5 cursor-pointer" onClick={onToggle}>
        <span className="text-white text-lg font-bold tracking-tight underline underline-offset-2">Stick&amp;Dot.</span>
      </div>
      <nav className="flex flex-col gap-0.5 px-3 flex-1">
        {items.map(({ label, href, icon: Icon }) => (
          <Link key={label} href={href} className={linkBase(href)}>
            <Icon size={17} strokeWidth={1.5} /><span>{label}</span>
          </Link>
        ))}
      </nav>
      <button onClick={onToggle} className="flex items-center justify-end px-5 pb-7 text-gray-600 hover:text-white cursor-pointer">
        <ChevronLeft size={16} />
      </button>
    </aside>
  );
}
