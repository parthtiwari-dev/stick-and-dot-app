"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home, Box, FilePlus, Settings, FolderOpen, Compass, DollarSign, FileText,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  { label: "Resources", href: "/resources", icon: Box },
  { label: "Explore", href: "/explore", icon: Compass },
  { label: "Create", href: "/create", icon: FilePlus },
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "My portfolio", href: "/portfolio", icon: FolderOpen },
  { label: "Leads", href: "/leads", icon: DollarSign },
];

const FAVOURITES = [
  { label: "Article 1", href: "/articles/article-1" },
  { label: "Article 1", href: "/articles/article-2" },
  { label: "Article 1", href: "/articles/article-3" },
];

interface AppSidebarProps {
  isCollapsed?: boolean;
  onToggle: () => void;
}

export default function AppSidebar({ isCollapsed = false, onToggle }: AppSidebarProps) {
  const pathname = usePathname();

  if (isCollapsed) {
    return (
      <aside className="fixed top-0 left-0 h-screen bg-black flex flex-col z-20 select-none transition-all duration-300 w-[72px]">
        <div onClick={onToggle} className="px-4 pt-8 pb-10 overflow-hidden cursor-pointer flex justify-center">
          <span className="text-white text-xl font-black">S</span>
        </div>
        <nav className="flex flex-col gap-1 px-2 flex-1">
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link key={href} href={href} title={label}
                className={`flex items-center justify-center py-3 rounded-full transition-all duration-200 ${
                  isActive ? "bg-white/15 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className={`flex items-center justify-center ${isActive ? "w-10 h-10 rounded-full bg-white/10" : ""}`}>
                  <Icon size={18} strokeWidth={1.5} className={isActive ? "text-white" : "text-gray-500"} />
                </span>
              </Link>
            );
          })}
        </nav>
        <div className="pb-8" />
      </aside>
    );
  }

  return (
    <aside className="fixed top-0 left-0 h-screen bg-white border-r border-gray-100 flex flex-col z-20 select-none transition-all duration-300 w-[220px]">
      <div onClick={onToggle} className="px-6 pt-8 pb-6 cursor-pointer">
        <span className="text-black text-xl font-bold tracking-tight underline underline-offset-2">Stick&amp;Dot.</span>
      </div>
      <div className="flex-1 overflow-y-auto px-4">
        <p className="text-xs text-gray-400 font-medium uppercase tracking-widest mb-3 px-2">Main Menu</p>
        <nav className="flex flex-col gap-0.5 mb-6">
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link key={href} href={href}
                className={`flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive ? "bg-black text-white" : "text-gray-600 hover:text-black hover:bg-gray-50"
                }`}
              >
                <Icon size={17} strokeWidth={1.5} className={isActive ? "text-white" : "text-gray-400"} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
        <p className="text-xs text-gray-400 font-medium uppercase tracking-widest mb-3 px-2">Favourite</p>
        <div className="flex flex-col gap-0.5">
          {FAVOURITES.map((fav, i) => (
            <Link key={i} href={fav.href}
              className="flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm text-gray-500 hover:text-black hover:bg-gray-50 transition-all duration-200"
            >
              <FileText size={16} strokeWidth={1.5} className="text-gray-400" />
              <span>{fav.label}</span>
            </Link>
          ))}
        </div>
      </div>
      <div className="pb-8" />
    </aside>
  );
}
