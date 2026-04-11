"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import AppLayout from "@/components/AppLayout";
import Link from "next/link";
import { Search, Clock, ArrowLeft, ArrowRight, X } from "lucide-react";

type Role = "writer" | "business" | "reader" | "subject-expert";

function storageRole(): Role {
  try {
    const r = localStorage.getItem("sd_role");
    if (r === "Reader") return "reader";
    if (r === "Client") return "business";
    if (r === "Subject Expert") return "subject-expert";
    if (r === "Writer") return "writer";
  } catch (_) {}
  return "reader";
}

const ROLE_CONFIG: Record<Role, { title: string; placeholder: string; tags: string[] }> = {
  reader:           { title: "Explore",                  placeholder: "Explore with Keywords, Topics or Authors…", tags: ["#technology","#design","#science","#career","#culture"] },
  writer:           { title: "Discover Trending Topics", placeholder: "Search trending topics, niches, keywords…",  tags: ["#trending","#technology","#finance","#health","#startups"] },
  business:         { title: "Explore Content",          placeholder: "Search content, writers, topics…",           tags: ["#marketing","#business","#growth","#strategy","#brand"] },
  "subject-expert": { title: "Explore Research",         placeholder: "Search research papers, topics, domains…",   tags: ["#research","#analysis","#insights","#domain","#data"] },
};

const ALL_CARDS = [
  { id:"1", title:"The Silent Revolution in Neural Computing", author:"Arthur Black",        mins:"8",  tag:"Technology", keywords:["technology","neural","computing","AI","tech"] },
  { id:"2", title:"How Minimalism Took Over the Design World", author:"Shaivya Saini",       mins:"5",  tag:"Design",     keywords:["design","minimalism","aesthetic","culture"] },
  { id:"3", title:"The Hidden Economics of Attention",         author:"Jerome Bell",         mins:"12", tag:"Finance",    keywords:["finance","economics","attention","business"] },
  { id:"4", title:"Why Slow Reading Is Making a Comeback",     author:"Priya Mehta",         mins:"6",  tag:"Culture",    keywords:["culture","reading","learning","career"] },
  { id:"5", title:"Building Products People Actually Love",    author:"Arthur Black",        mins:"9",  tag:"Business",   keywords:["business","product","startups","growth","strategy"] },
];

const CARD_STYLES = [
  { bg:"#1a0533", blob1:"#7c3aed", blob2:"#c026d3", blob3:"#4f46e5" },
  { bg:"#0d1f33", blob1:"#0ea5e9", blob2:"#6366f1", blob3:"#06b6d4" },
  { bg:"#1a1a0d", blob1:"#ca8a04", blob2:"#ea580c", blob3:"#84cc16" },
  { bg:"#0d1a1a", blob1:"#0d9488", blob2:"#0891b2", blob3:"#4ade80" },
  { bg:"#1a0d0d", blob1:"#dc2626", blob2:"#db2777", blob3:"#f97316" },
];

function MeshCard({ card, style, size }: {
  card: typeof ALL_CARDS[0];
  style: typeof CARD_STYLES[0];
  size: "sm" | "lg";
}) {
  const h = size === "lg" ? 380 : 290;
  return (
    <div className="relative rounded-3xl overflow-hidden select-none" style={{ height: h, background: style.bg }}>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute rounded-full opacity-40 blur-3xl" style={{ width:220, height:220, background:style.blob1, top:-60, left:-40 }} />
        <div className="absolute rounded-full opacity-30 blur-3xl" style={{ width:180, height:180, background:style.blob2, bottom:20, right:-30 }} />
        <div className="absolute rounded-full opacity-20 blur-2xl" style={{ width:140, height:140, background:style.blob3, top:"40%", left:"40%" }} />
      </div>
      {size === "lg" && (
        <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/20 text-white/80 text-xs px-3 py-1.5 rounded-full">
          <Clock size={10} />{card.mins} mins read
        </div>
      )}
      <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-md border border-white/20 text-white/70 text-xs px-3 py-1 rounded-full">
        {card.tag}
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <h3 className={`text-white font-bold leading-tight mb-3 ${size === "lg" ? "text-xl" : "text-base"}`}>{card.title}</h3>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-white/20 border border-white/30 flex-shrink-0 flex items-center justify-center text-white text-xs font-bold">{card.author[0]}</div>
          <span className="text-white/60 text-xs">{card.author}</span>
        </div>
      </div>
    </div>
  );
}

export default function ExplorePage() {
  const [query, setQuery]       = useState("");
  const [activeTag, setActiveTag] = useState("");
  const [role, setRole]         = useState<Role>("reader");
  const [active, setActive]     = useState(0);

  useEffect(() => { setRole(storageRole()); }, []);

  // Filter cards by query + active tag
  const filteredCards = useMemo(() => {
    let cards = ALL_CARDS;
    if (activeTag) {
      const tag = activeTag.replace("#", "").toLowerCase();
      cards = cards.filter(c =>
        c.tag.toLowerCase().includes(tag) ||
        c.keywords.some(k => k.includes(tag))
      );
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      cards = cards.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.author.toLowerCase().includes(q) ||
        c.tag.toLowerCase().includes(q) ||
        c.keywords.some(k => k.includes(q))
      );
    }
    return cards.length > 0 ? cards : ALL_CARDS; // fallback to all if no results
  }, [query, activeTag]);

  // Reset active index when filtered list changes
  useEffect(() => { setActive(0); }, [filteredCards]);

  const prev = useCallback(() => setActive(i => (i - 1 + filteredCards.length) % filteredCards.length), [filteredCards.length]);
  const next = useCallback(() => setActive(i => (i + 1) % filteredCards.length), [filteredCards.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft")  prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [prev, next]);

  const config = ROLE_CONFIG[role];
  const safeActive = Math.min(active, filteredCards.length - 1);
  const leftIdx  = (safeActive - 1 + filteredCards.length) % filteredCards.length;
  const rightIdx = (safeActive + 1) % filteredCards.length;
  const hasFilter = query.trim() || activeTag;

  return (
    <AppLayout bg="bg-[#0d0d0d]">
      <div className="min-h-screen flex flex-col px-4 md:px-8 pt-8 pb-12" style={{ color:"#fff" }}>
        <h1 className="text-4xl md:text-5xl font-black text-center text-white mb-2 tracking-tight">{config.title}</h1>
        <p className="text-center text-white/40 text-sm mb-8">Discover stories that matter to you</p>

        {/* Search */}
        <div className="flex justify-center mb-6">
          <div className="relative w-full max-w-xl">
            <Search size={15} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30" />
            <input type="text" value={query} onChange={e => setQuery(e.target.value)}
              placeholder={config.placeholder}
              className="w-full pl-12 pr-10 py-3.5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm text-white placeholder:text-white/25 outline-none focus:border-white/25 text-sm transition-all" />
            {query && (
              <button onClick={() => setQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 cursor-pointer transition-colors">
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {config.tags.map((t, i) => (
            <button key={i} onClick={() => setActiveTag(activeTag === t ? "" : t)}
              className={`text-xs px-4 py-2 rounded-full border transition-all cursor-pointer font-medium ${
                activeTag === t ? "bg-white text-black border-white" : "bg-white/5 text-white/50 border-white/10 hover:bg-white/10 hover:text-white/80"
              }`}>{t}</button>
          ))}
        </div>

        {/* Filter status */}
        {hasFilter && (
          <div className="flex items-center justify-center gap-2 mb-6">
            <p className="text-white/40 text-xs">
              Showing {filteredCards.length} result{filteredCards.length !== 1 ? "s" : ""}
              {query ? ` for "${query}"` : ""}
              {activeTag ? ` in ${activeTag}` : ""}
            </p>
            <button onClick={() => { setQuery(""); setActiveTag(""); }} className="text-white/30 hover:text-white/60 text-xs underline cursor-pointer transition-colors">Clear</button>
          </div>
        )}

        {/* Carousel */}
        <div className="flex-1 flex flex-col items-center">
          <div className="relative w-full flex items-center justify-center gap-0">
            <button onClick={prev}
              className="flex-shrink-0 z-20 mr-3 md:mr-5 w-11 h-11 rounded-2xl bg-white/8 hover:bg-white/15 border border-white/10 flex items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-95 group">
              <ArrowLeft size={18} className="text-white/60 group-hover:text-white transition-colors" />
            </button>

            <div className="flex items-center gap-4 md:gap-6 justify-center overflow-visible">
              {filteredCards.length > 1 && (
                <div onClick={prev} className="hidden sm:block cursor-pointer transition-all duration-500 opacity-40 hover:opacity-60 scale-90 hover:scale-95 flex-shrink-0" style={{ width: 220 }}>
                  <MeshCard card={filteredCards[leftIdx]} style={CARD_STYLES[leftIdx % CARD_STYLES.length]} size="sm" />
                </div>
              )}

              <div className="flex-shrink-0 transition-all duration-500" style={{ width: "min(360px, 90vw)" }}>
                <Link href={`/articles/${filteredCards[safeActive].id}`}>
                  <div className="transition-all duration-500 hover:scale-[1.02] cursor-pointer shadow-2xl" style={{ filter:"drop-shadow(0 0 40px rgba(255,255,255,0.07))" }}>
                    <MeshCard card={filteredCards[safeActive]} style={CARD_STYLES[safeActive % CARD_STYLES.length]} size="lg" />
                  </div>
                </Link>
                <div className="mt-5 text-center px-2">
                  <p className="text-white/45 text-sm leading-relaxed mb-4">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  </p>
                  <Link href={`/articles/${filteredCards[safeActive].id}`}>
                    <button className="inline-flex items-center gap-2 bg-white text-black text-sm font-bold px-7 py-3 rounded-2xl hover:bg-white/90 transition-all cursor-pointer hover:scale-[1.03] active:scale-95">
                      Read Now <ArrowRight size={14} />
                    </button>
                  </Link>
                </div>
              </div>

              {filteredCards.length > 1 && (
                <div onClick={next} className="hidden sm:block cursor-pointer transition-all duration-500 opacity-40 hover:opacity-60 scale-90 hover:scale-95 flex-shrink-0" style={{ width: 220 }}>
                  <MeshCard card={filteredCards[rightIdx]} style={CARD_STYLES[rightIdx % CARD_STYLES.length]} size="sm" />
                </div>
              )}
            </div>

            <button onClick={next}
              className="flex-shrink-0 z-20 ml-3 md:ml-5 w-11 h-11 rounded-2xl bg-white/8 hover:bg-white/15 border border-white/10 flex items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-95 group">
              <ArrowRight size={18} className="text-white/60 group-hover:text-white transition-colors" />
            </button>
          </div>

          <div className="flex items-center gap-2 mt-10">
            {filteredCards.map((_, i) => (
              <button key={i} onClick={() => setActive(i)}
                className={`rounded-full transition-all duration-300 cursor-pointer ${i === safeActive ? "w-7 h-2 bg-white" : "w-2 h-2 bg-white/20 hover:bg-white/40"}`} />
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
