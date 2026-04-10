"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home, Box, FilePlus, Settings, FolderOpen, User, LogIn, Rocket, Gift,
} from "lucide-react";
import { useUser } from "./UserContext";

const BUSINESS_NAV = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  { label: "Resources", href: "/resources", icon: Box },
  { label: "Create", href: "/dashboard/create", icon: FilePlus },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
  { label: "My portfolio", href: "/portfolio", icon: FolderOpen },
];

const WRITER_MAIN_MENU = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  { label: "Resources", href: "/resources", icon: Box },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
  { label: "Lorem Ipsum", href: "/lorem", icon: Gift },
];

const WRITER_ACCOUNT_PAGES = [
  { label: "Profile", href: "/dashboard/profile", icon: User },
  { label: "Sign In", href: "/login", icon: LogIn },
  { label: "Sign Up", href: "/signup", icon: Rocket },
];

interface AppSidebarProps {
  isCollapsed?: boolean;
  onToggle: () => void;
}

export default function AppSidebar({ isCollapsed = false, onToggle }: AppSidebarProps) {
  const pathname = usePathname();
  const { userRole } = useUser();
  const isBusinessUser = userRole === "Client";

  if (isCollapsed) {
    const items = isBusinessUser
      ? BUSINESS_NAV
      : [...WRITER_MAIN_MENU, ...WRITER_ACCOUNT_PAGES];
    return (
      <aside className="fixed top-0 left-0 h-screen bg-black flex flex-col z-20 select-none transition-all duration-300 w-[72px] rounded-r-2xl">
        <div onClick={onToggle} className="px-4 pt-8 pb-8 overflow-hidden cursor-pointer flex justify-center">
          <span className="text-white text-xl font-black">S</span>
        </div>
        <nav className="flex flex-col gap-1 px-2 flex-1">
          {items.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link key={href} href={href} title={label}
                className={`flex items-center justify-center py-3 rounded-xl transition-all duration-200 ${
                  isActive ? "text-white" : "text-gray-500 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon size={18} strokeWidth={1.5} className={isActive ? "text-white" : "text-gray-500"} />
              </Link>
            );
          })}
        </nav>
        <div className="pb-8" />
      </aside>
    );
  }

  if (isBusinessUser) {
    return (
      <aside className="fixed top-0 left-0 h-screen bg-black flex flex-col z-20 select-none transition-all duration-300 w-[200px] rounded-r-2xl">
        <div onClick={onToggle} className="px-6 pt-8 pb-8 cursor-pointer">
          <span className="text-white text-xl font-bold tracking-tight underline underline-offset-2">Stick&amp;Dot.</span>
        </div>
        <nav className="flex flex-col gap-1 px-4 flex-1">
          {BUSINESS_NAV.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link key={href} href={href}
                className={`flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm transition-all duration-200 ${
                  isActive ? "text-white font-semibold" : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                }`}
              >
                <Icon size={17} strokeWidth={1.5} className={isActive ? "text-white" : "text-gray-500"} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="pb-8" />
      </aside>
    );
  }

  return (
    <aside className="fixed top-0 left-0 h-screen bg-black flex flex-col z-20 select-none transition-all duration-300 w-[200px] rounded-r-2xl">
      <div onClick={onToggle} className="px-6 pt-8 pb-6 cursor-pointer">
        <span className="text-white text-xl font-bold tracking-tight underline underline-offset-2">Stick&amp;Dot.</span>
      </div>
      <div className="flex-1 overflow-y-auto px-4">
        <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest mb-2 px-1">Main Menu</p>
        <nav className="flex flex-col gap-0.5 mb-5">
          {WRITER_MAIN_MENU.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link key={href} href={href}
                className={`flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm transition-all duration-200 ${
                  isActive ? "bg-[#1a1a1a] text-white font-semibold" : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                }`}
              >
                <Icon size={17} strokeWidth={1.5} className={isActive ? "text-white" : "text-gray-500"} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
        <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest mb-2 px-1">Account Pages</p>
        <nav className="flex flex-col gap-0.5">
          {WRITER_ACCOUNT_PAGES.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link key={href} href={href}
                className={`flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm transition-all duration-200 ${
                  isActive ? "bg-[#1a1a1a] text-white font-semibold" : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                }`}
              >
                <Icon size={17} strokeWidth={1.5} className={isActive ? "text-white" : "text-gray-500"} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="pb-8" />
    </aside>
  );
}
