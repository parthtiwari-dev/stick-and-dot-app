"use client";
import { useState, useEffect, useCallback } from "react";
import AppLayout from "@/components/AppLayout";
import Link from "next/link";
import { Search, Clock, ArrowLeft, ArrowRight } from "lucide-react";

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

const CARDS = [
  { id:"1", title:"The Silent Revolution in Neural Computing", author:"Arthur Black",        mins:"8",  tag:"Technology" },
  { id:"2", title:"How Minimalism Took Over the Design World", author:"Shaivya Saini",       mins:"5",  tag:"Design"     },
  { id:"3", title:"The Hidden Economics of Attention",         author:"Jerome Bell",         mins:"12", tag:"Finance"    },
  { id:"4", title:"Why Slow Reading Is Making a Comeback",     author:"Priya Mehta",         mins:"6",  tag:"Culture"    },
  { id:"5", title:"Building Products People Actually Love",    author:"NAME AUTHOR/BUSINESS",mins:"9",  tag:"Business"   },
];

// Beautiful mesh-gradient backgrounds per card
const CARD_STYLES = [
  { bg:"#1a0533", blob1:"#7c3aed", blob2:"#c026d3", blob3:"#4f46e5" },
  { bg:"#0d1f33", blob1:"#0ea5e9", blob2:"#6366f1", blob3:"#06b6d4" },
  { bg:"#1a1a0d", blob1:"#ca8a04", blob2:"#ea580c", blob3:"#84cc16" },
  { bg:"#0d1a1a", blob1:"#0d9488", blob2:"#0891b2", blob3:"#4ade80" },
  { bg:"#1a0d0d", blob1:"#dc2626", blob2:"#db2777", blob3:"#f97316" },
];

function MeshCard({ card, style, size }: {
  card: typeof CARDS[0];
  style: typeof CARD_STYLES[0];
  size: "sm" | "lg";
}) {
  const h = size === "lg" ? 380 : 290;
  return (
    <div
      className="relative rounded-3xl overflow-hidden select-none"
      style={{ height: h, background: style.bg }}
    >
      {/* Blurred mesh blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute rounded-full opacity-40 blur-3xl"
          style={{ width:220, height:220, background:style.blob1, top:-60, left:-40 }} />
        <div className="absolute rounded-full opacity-30 blur-3xl"
          style={{ width:180, height:180, background:style.blob2, bottom:20, right:-30 }} />
        <div className="absolute rounded-full opacity-20 blur-2xl"
          style={{ width:140, height:140, background:style.blob3, top:"40%", left:"40%" }} />
      </div>
      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")" }} />

      {/* Top badge */}
      {size === "lg" && (
        <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/20 text-white/80 text-xs px-3 py-1.5 rounded-full">
          <Clock size={10} />{card.mins} mins read
        </div>
      )}
      <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-md border border-white/20 text-white/70 text-xs px-3 py-1 rounded-full">
        {card.tag}
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <div className="mb-3">
          <h3 className={`text-white font-bold leading-tight ${size === "lg" ? "text-xl" : "text-base"}`}>
            {card.title}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-white/20 border border-white/30 flex-shrink-0 flex items-center justify-center text-white text-xs font-bold">
            {card.author[0]}
          </div>
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
  const [dir, setDir]           = useState<1|-1>(1);

  useEffect(() => { setRole(storageRole()); }, []);

  const prev = useCallback(() => { setDir(-1); setActive(i => (i - 1 + CARDS.length) % CARDS.length); }, []);
  const next = useCallback(() => { setDir(1);  setActive(i => (i + 1) % CARDS.length); }, []);

  // keyboard nav
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft")  prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [prev, next]);

  const config = ROLE_CONFIG[role];
  const leftIdx  = (active - 1 + CARDS.length) % CARDS.length;
  const rightIdx = (active + 1) % CARDS.length;

  return (
    <AppLayout bg="bg-[#0d0d0d]">
      <div className="min-h-screen flex flex-col px-4 md:px-8 pt-8 pb-12" style={{ color:"#fff" }}>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-black text-center text-white mb-2 tracking-tight">
          {config.title}
        </h1>
        <p className="text-center text-white/40 text-sm mb-8">Discover stories that matter to you</p>

        {/* Search */}
        <div className="flex justify-center mb-6">
          <div className="relative w-full max-w-xl">
            <Search size={15} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === "Enter" && setQuery(query)}
              placeholder={config.placeholder}
              className="w-full pl-12 pr-5 py-3.5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm text-white placeholder:text-white/25 outline-none focus:border-white/25 text-sm transition-all"
            />
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {config.tags.map((t, i) => (
            <button key={i} onClick={() => setActiveTag(activeTag === t ? "" : t)}
              className={`text-xs px-4 py-2 rounded-full border transition-all cursor-pointer font-medium ${
                activeTag === t
                  ? "bg-white text-black border-white"
                  : "bg-white/5 text-white/50 border-white/10 hover:bg-white/10 hover:text-white/80"
              }`}>
              {t}
            </button>
          ))}
        </div>

        {/* Carousel */}
        <div className="flex-1 flex flex-col items-center">
          <div className="relative w-full flex items-center justify-center gap-0">

            {/* Prev arrow */}
            <button onClick={prev}
              className="flex-shrink-0 z-20 mr-3 md:mr-5 w-11 h-11 rounded-2xl bg-white/8 hover:bg-white/15 border border-white/10 flex items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-95 group">
              <ArrowLeft size={18} className="text-white/60 group-hover:text-white transition-colors" />
            </button>

            {/* Cards row */}
            <div className="flex items-center gap-4 md:gap-6 justify-center overflow-visible">
              {/* Left card */}
              <div onClick={prev}
                className="hidden sm:block cursor-pointer transition-all duration-500 opacity-40 hover:opacity-60 scale-90 hover:scale-95 flex-shrink-0"
                style={{ width: 220 }}>
                <MeshCard card={CARDS[leftIdx]} style={CARD_STYLES[leftIdx % CARD_STYLES.length]} size="sm" />
              </div>

              {/* Featured centre card */}
              <div className="flex-shrink-0 transition-all duration-500" style={{ width: "min(360px, 90vw)" }}>
                <Link href={`/articles/${CARDS[active].id}`}>
                  <div className="transition-all duration-500 hover:scale-[1.02] cursor-pointer shadow-2xl" style={{ filter:"drop-shadow(0 0 40px rgba(255,255,255,0.07))" }}>
                    <MeshCard card={CARDS[active]} style={CARD_STYLES[active % CARD_STYLES.length]} size="lg" />
                  </div>
                </Link>

                {/* Excerpt + CTA below featured */}
                <div className="mt-5 text-center px-2">
                  <p className="text-white/45 text-sm leading-relaxed mb-4">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  </p>
                  <Link href={`/articles/${CARDS[active].id}`}>
                    <button className="inline-flex items-center gap-2 bg-white text-black text-sm font-bold px-7 py-3 rounded-2xl hover:bg-white/90 transition-all cursor-pointer hover:scale-[1.03] active:scale-95">
                      Read Now <ArrowRight size={14} />
                    </button>
                  </Link>
                </div>
              </div>

              {/* Right card */}
              <div onClick={next}
                className="hidden sm:block cursor-pointer transition-all duration-500 opacity-40 hover:opacity-60 scale-90 hover:scale-95 flex-shrink-0"
                style={{ width: 220 }}>
                <MeshCard card={CARDS[rightIdx]} style={CARD_STYLES[rightIdx % CARD_STYLES.length]} size="sm" />
              </div>
            </div>

            {/* Next arrow */}
            <button onClick={next}
              className="flex-shrink-0 z-20 ml-3 md:ml-5 w-11 h-11 rounded-2xl bg-white/8 hover:bg-white/15 border border-white/10 flex items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-95 group">
              <ArrowRight size={18} className="text-white/60 group-hover:text-white transition-colors" />
            </button>
          </div>

          {/* Dot indicators */}
          <div className="flex items-center gap-2 mt-10">
            {CARDS.map((_, i) => (
              <button key={i} onClick={() => { setDir(i > active ? 1 : -1); setActive(i); }}
                className={`rounded-full transition-all duration-300 cursor-pointer ${
                  i === active ? "w-7 h-2 bg-white" : "w-2 h-2 bg-white/20 hover:bg-white/40"
                }`} />
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
