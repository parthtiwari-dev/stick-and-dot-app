"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Box, FilePlus, Settings, FolderOpen, User, LogIn, Rocket, Gift, Compass } from "lucide-react";

/* ── Infer role from current URL path ── */
function useRoleFromPath(): "writer" | "business" | "reader" | "subject-expert" {
  const pathname = usePathname();
  if (pathname.startsWith("/dashboard/business")) return "business";
  if (pathname.startsWith("/dashboard/reader")) return "reader";
  if (pathname.startsWith("/dashboard/subject-expert")) return "subject-expert";
  return "writer";
}

/* ── Nav configs per role ── */
const NAV_CONFIG = {
  writer: {
    mainMenu: [
      { label: "Dashboard", href: "/dashboard/writer", icon: Home },
      { label: "Resources", href: "/resources", icon: Box },
      { label: "Settings", href: "/dashboard/writer/settings", icon: Settings },
      { label: "Lorem Ipsum", href: "/lorem", icon: Gift },
    ],
    accountPages: [
      { label: "Profile", href: "/dashboard/writer/profile", icon: User },
      { label: "Sign In", href: "/login", icon: LogIn },
      { label: "Sign Up", href: "/signup", icon: Rocket },
    ],
  },
  business: {
    mainItems: [
      { label: "Dashboard", href: "/dashboard/business", icon: Home },
      { label: "Resources", href: "/resources", icon: Box },
      { label: "Create", href: "/dashboard/business/create", icon: FilePlus },
      { label: "Settings", href: "/dashboard/business/settings", icon: Settings },
      { label: "My portfolio", href: "/portfolio", icon: FolderOpen },
    ],
  },
  reader: {
    mainMenu: [
      { label: "Dashboard", href: "/dashboard/reader", icon: Home },
      { label: "Explore", href: "/explore", icon: Compass },
      { label: "My Portfolio", href: "/portfolio", icon: FolderOpen },
      { label: "Settings", href: "/dashboard/reader/settings", icon: Settings },
    ],
    accountPages: [
      { label: "Profile", href: "/dashboard/reader/profile", icon: User },
      { label: "Sign In", href: "/login", icon: LogIn },
      { label: "Sign Up", href: "/signup", icon: Rocket },
    ],
  },
  "subject-expert": {
    mainMenu: [
      { label: "Dashboard", href: "/dashboard/subject-expert", icon: Home },
      { label: "Resources", href: "/resources", icon: Box },
      { label: "Settings", href: "/dashboard/subject-expert/settings", icon: Settings },
      { label: "Lorem Ipsum", href: "/lorem", icon: Gift },
    ],
    accountPages: [
      { label: "Profile", href: "/dashboard/subject-expert/profile", icon: User },
      { label: "Sign In", href: "/login", icon: LogIn },
      { label: "Sign Up", href: "/signup", icon: Rocket },
    ],
  },
};

interface AppSidebarProps {
  isCollapsed?: boolean;
  onToggle: () => void;
}

export default function AppSidebar({ isCollapsed = false, onToggle }: AppSidebarProps) {
  const pathname = usePathname();
  const role = useRoleFromPath();
  const isActive = (href: string) => pathname === href || (href !== "/" && pathname.startsWith(href + "/"));

  const linkCls = (href: string, active?: boolean) =>
    `flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm transition-all duration-200 ${
      (active ?? isActive(href))
        ? "bg-[#1a1a1a] text-white font-semibold"
        : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
    }`;

  const iconCls = (href: string, active?: boolean) =>
    (active ?? isActive(href)) ? "text-white" : "text-gray-500";

  /* ── Collapsed: icons only ── */
  if (isCollapsed) {
    const items = role === "business"
      ? NAV_CONFIG.business.mainItems
      : [...NAV_CONFIG[role].mainMenu, ...NAV_CONFIG[role].accountPages];
    return (
      <aside className="fixed top-0 left-0 h-screen bg-black flex flex-col z-20 select-none transition-all duration-300 w-[72px] rounded-r-2xl">
        <div onClick={onToggle} className="pt-8 pb-8 flex justify-center cursor-pointer">
          <span className="text-white text-xl font-black">S</span>
        </div>
        <nav className="flex flex-col gap-1 px-2 flex-1">
          {items.map(({ label, href, icon: Icon }) => (
            <Link key={href} href={href} title={label}
              className={`flex items-center justify-center py-3 rounded-xl transition-all ${
                isActive(href) ? "text-white" : "text-gray-500 hover:text-white hover:bg-white/5"
              }`}>
              <Icon size={18} strokeWidth={1.5} className={iconCls(href)} />
            </Link>
          ))}
        </nav>
        <div className="pb-8" />
      </aside>
    );
  }

  /* ── Business expanded: flat 5-item dark sidebar ── */
  if (role === "business") {
    return (
      <aside className="fixed top-0 left-0 h-screen bg-black flex flex-col z-20 select-none transition-all duration-300 w-[200px] rounded-r-2xl">
        <div onClick={onToggle} className="px-6 pt-8 pb-8 cursor-pointer">
          <span className="text-white text-xl font-bold tracking-tight underline underline-offset-2">Stick&amp;Dot.</span>
        </div>
        <nav className="flex flex-col gap-1 px-4 flex-1">
          {NAV_CONFIG.business.mainItems.map(({ label, href, icon: Icon }) => (
            <Link key={href} href={href} className={linkCls(href)}>
              <Icon size={17} strokeWidth={1.5} className={iconCls(href)} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
        <div className="pb-8" />
      </aside>
    );
  }

  /* ── Writer / Reader / Subject Expert: categorized dark sidebar ── */
  const cfg = NAV_CONFIG[role] as { mainMenu: typeof NAV_CONFIG.writer.mainMenu; accountPages: typeof NAV_CONFIG.writer.accountPages };
  return (
    <aside className="fixed top-0 left-0 h-screen bg-black flex flex-col z-20 select-none transition-all duration-300 w-[200px] rounded-r-2xl">
      <div onClick={onToggle} className="px-6 pt-8 pb-6 cursor-pointer">
        <span className="text-white text-xl font-bold tracking-tight underline underline-offset-2">Stick&amp;Dot.</span>
      </div>
      <div className="flex-1 overflow-y-auto px-4">
        <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest mb-2 px-1">Main Menu</p>
        <nav className="flex flex-col gap-0.5 mb-5">
          {cfg.mainMenu.map(({ label, href, icon: Icon }) => (
            <Link key={href} href={href} className={linkCls(href)}>
              <Icon size={17} strokeWidth={1.5} className={iconCls(href)} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
        <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest mb-2 px-1">Account Pages</p>
        <nav className="flex flex-col gap-0.5">
          {cfg.accountPages.map(({ label, href, icon: Icon }) => (
            <Link key={href} href={href} className={linkCls(href)}>
              <Icon size={17} strokeWidth={1.5} className={iconCls(href)} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      </div>
      <div className="pb-8" />
    </aside>
  );
}
