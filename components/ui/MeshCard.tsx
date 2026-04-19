import { Clock } from "lucide-react";
import Link from "next/link";

export const MESH_STYLES = [
  { bg:"#1a0533", blob1:"#7c3aed", blob2:"#c026d3", blob3:"#4f46e5" },
  { bg:"#0d1f33", blob1:"#0ea5e9", blob2:"#6366f1", blob3:"#06b6d4" },
  { bg:"#1a1a0d", blob1:"#ca8a04", blob2:"#ea580c", blob3:"#84cc16" },
  { bg:"#0d1a1a", blob1:"#0d9488", blob2:"#0891b2", blob3:"#4ade80" },
  { bg:"#1a0d0d", blob1:"#dc2626", blob2:"#db2777", blob3:"#f97316" },
];

interface MeshCardProps {
  title: string;
  author?: string;
  tag?: string;
  mins?: number | string;
  badge?: string;
  badgeColor?: "orange" | "green" | "default";
  actionLabel?: string;
  onAction?: () => void;
  href?: string;
  styleIndex?: number;
  size?: "lg" | "sm";
  height?: number;
}

export default function MeshCard({
  title, author, tag, mins, badge, badgeColor = "default",
  actionLabel, onAction, href, styleIndex = 0, size, height,
}: MeshCardProps) {
  const s = MESH_STYLES[styleIndex % MESH_STYLES.length];
  const h = height ?? (size === "lg" ? 380 : size === "sm" ? 290 : 260);
  const badgeCls =
    badgeColor === "orange" ? "bg-orange-500/80 text-white border-orange-400/40" :
    badgeColor === "green"  ? "bg-green-500/80 text-white border-green-400/40"   :
                              "bg-white/15 text-white/90 border-white/20";

  const inner = (
    <div className="relative rounded-3xl overflow-hidden select-none" style={{ height: h, background: s.bg }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute rounded-full opacity-40 blur-3xl" style={{ width:220, height:220, background:s.blob1, top:-60, left:-40 }} />
        <div className="absolute rounded-full opacity-30 blur-3xl" style={{ width:180, height:180, background:s.blob2, bottom:20, right:-30 }} />
        <div className="absolute rounded-full opacity-20 blur-2xl" style={{ width:140, height:140, background:s.blob3, top:"40%", left:"40%" }} />
      </div>
      <div className="absolute top-4 left-4 right-4 flex items-start justify-between gap-2 z-10">
        <div className="flex flex-col items-start gap-1.5">
          {tag && <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white/80 text-xs px-3 py-1 rounded-full">{tag}</span>}
          {badge && <span className={`backdrop-blur-md border text-xs px-3 py-1 rounded-full font-semibold ${badgeCls}`}>{badge}</span>}
        </div>
        {mins !== undefined && (
          <span className="flex items-center gap-1 bg-white/10 backdrop-blur-md border border-white/20 text-white/70 text-xs px-3 py-1.5 rounded-full flex-shrink-0">
            <Clock size={10} />{mins} min
          </span>
        )}
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-5 z-10" style={{ background:"linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 100%)" }}>
        <h3 className="text-white font-bold leading-snug mb-2 text-base line-clamp-2">{title}</h3>
        {author && (
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-white/20 border border-white/30 flex-shrink-0 flex items-center justify-center text-white text-[10px] font-bold">{author[0]}</div>
            <span className="text-white/60 text-xs truncate">{author}</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col">
      {href ? <Link href={href} className="block hover:opacity-90 transition-opacity">{inner}</Link> : inner}
      {actionLabel && onAction && (
        <button onClick={onAction} className="mt-3 w-full py-2.5 rounded-2xl text-sm font-semibold bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all cursor-pointer backdrop-blur-sm">
          {actionLabel}
        </button>
      )}
    </div>
  );
}
