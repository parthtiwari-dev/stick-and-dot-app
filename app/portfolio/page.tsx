"use client";
import { useState, useEffect, useCallback } from "react";
import AppLayout from "@/components/AppLayout";
import Link from "next/link";
import { Clock, ArrowLeft, ArrowRight, Star } from "lucide-react";

const CARDS = [
  { id:"1", title:"The Silent Revolution in Neural Computing", author:"Shaivya Saini", mins:"8",  tag:"Technology", rating:4.8, views:"12.4K" },
  { id:"2", title:"How Minimalism Took Over the Design World", author:"Shaivya Saini", mins:"5",  tag:"Design",     rating:4.5, views:"9.1K"  },
  { id:"3", title:"The Hidden Economics of Attention",         author:"Shaivya Saini", mins:"12", tag:"Finance",    rating:4.9, views:"18.7K" },
  { id:"4", title:"Why Slow Reading Is Making a Comeback",     author:"Shaivya Saini", mins:"6",  tag:"Culture",    rating:4.3, views:"7.2K"  },
  { id:"5", title:"Building Products People Actually Love",    author:"Shaivya Saini", mins:"9",  tag:"Business",   rating:4.7, views:"14.0K" },
];

const CARD_STYLES = [
  { bg:"#0f0a1e", blob1:"#7c3aed", blob2:"#c026d3", blob3:"#4f46e5" },
  { bg:"#071520", blob1:"#0ea5e9", blob2:"#6366f1", blob3:"#06b6d4" },
  { bg:"#150f00", blob1:"#ca8a04", blob2:"#ea580c", blob3:"#84cc16" },
  { bg:"#031212", blob1:"#0d9488", blob2:"#0891b2", blob3:"#4ade80" },
  { bg:"#160606", blob1:"#dc2626", blob2:"#db2777", blob3:"#f97316" },
];

function MeshCard({ card, style, size }: {
  card: typeof CARDS[0];
  style: typeof CARD_STYLES[0];
  size: "sm" | "lg";
}) {
  const h = size === "lg" ? 400 : 300;
  return (
    <div className="relative rounded-3xl overflow-hidden select-none w-full"
      style={{ height: h, background: style.bg }}>
      {/* Mesh blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute rounded-full opacity-45 blur-3xl"
          style={{ width:240, height:240, background:style.blob1, top:-80, left:-60 }} />
        <div className="absolute rounded-full opacity-30 blur-3xl"
          style={{ width:200, height:200, background:style.blob2, bottom:0, right:-50 }} />
        <div className="absolute rounded-full opacity-20 blur-2xl"
          style={{ width:160, height:160, background:style.blob3, top:"50%", left:"50%" }} />
      </div>
      {/* Noise */}
      <div className="absolute inset-0 opacity-[0.035]"
        style={{ backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")" }} />

      {/* Badges */}
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white/70 text-xs px-3 py-1 rounded-full">
          {card.tag}
        </span>
      </div>
      {size === "lg" && (
        <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/20 text-white/70 text-xs px-3 py-1.5 rounded-full">
          <Clock size={10} />{card.mins} min
        </div>
      )}

      {/* Stats pill — only on lg */}
      {size === "lg" && (
        <div className="absolute bottom-20 right-4 flex items-center gap-3">
          <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md rounded-full px-3 py-1.5">
            <Star size={10} fill="#F97316" className="text-[#F97316]" />
            <span className="text-white/80 text-xs font-semibold">{card.rating}</span>
          </div>
          <div className="bg-black/40 backdrop-blur-md rounded-full px-3 py-1.5">
            <span className="text-white/60 text-xs">{card.views} views</span>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/60 to-transparent pt-12">
        <h3 className={`text-white font-bold leading-snug mb-2 ${size === "lg" ? "text-lg" : "text-sm"}`}>
          {card.title}
        </h3>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex-shrink-0 flex items-center justify-center text-white text-xs font-bold">
            {card.author[0]}
          </div>
          <span className="text-white/55 text-xs">{card.author}</span>
        </div>
      </div>
    </div>
  );
}

export default function PortfolioPage() {
  const [active, setActive] = useState(0);

  const prev = useCallback(() => setActive(i => (i - 1 + CARDS.length) % CARDS.length), []);
  const next = useCallback(() => setActive(i => (i + 1) % CARDS.length), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft")  prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [prev, next]);

  const leftIdx  = (active - 1 + CARDS.length) % CARDS.length;
  const rightIdx = (active + 1) % CARDS.length;
  const current  = CARDS[active];

  return (
    <AppLayout bg="bg-[#0d0d0d]">
      <div className="min-h-screen flex flex-col px-4 md:px-8 pt-8 pb-12">

        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-white/30 text-xs font-semibold uppercase tracking-widest mb-2">Writer</p>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">My Portfolio</h1>
          <p className="text-white/35 text-sm">{CARDS.length} published articles</p>
        </div>

        {/* Carousel */}
        <div className="flex-1 flex flex-col items-center">
          <div className="relative w-full flex items-center justify-center">

            {/* Prev */}
            <button onClick={prev}
              className="flex-shrink-0 z-20 mr-3 md:mr-6 w-11 h-11 rounded-2xl bg-white/8 hover:bg-white/15 border border-white/10 flex items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-95 group">
              <ArrowLeft size={18} className="text-white/50 group-hover:text-white transition-colors" />
            </button>

            {/* Cards */}
            <div className="flex items-center gap-4 md:gap-5 justify-center">
              {/* Left */}
              <div onClick={prev} className="hidden sm:block cursor-pointer flex-shrink-0 transition-all duration-500 opacity-35 hover:opacity-55 scale-90 hover:scale-[0.93]"
                style={{ width: 210 }}>
                <MeshCard card={CARDS[leftIdx]} style={CARD_STYLES[leftIdx % CARD_STYLES.length]} size="sm" />
              </div>

              {/* Centre featured */}
              <div className="flex-shrink-0 transition-all duration-500" style={{ width: "min(380px, 90vw)" }}>
                <Link href={`/articles/${current.id}`}>
                  <div className="cursor-pointer hover:scale-[1.02] transition-all duration-300"
                    style={{ filter:"drop-shadow(0 0 50px rgba(255,255,255,0.06))" }}>
                    <MeshCard card={current} style={CARD_STYLES[active % CARD_STYLES.length]} size="lg" />
                  </div>
                </Link>

                {/* Info row below card */}
                <div className="mt-5 flex items-center justify-between px-1">
                  <div>
                    <p className="text-white/70 text-xs font-medium mb-0.5">Published</p>
                    <p className="text-white/35 text-xs">10 / 2 / 2023</p>
                  </div>
                  <Link href={`/articles/${current.id}`}>
                    <button className="flex items-center gap-2 bg-white text-black text-sm font-bold px-6 py-2.5 rounded-2xl hover:bg-white/90 transition-all cursor-pointer hover:scale-[1.03] active:scale-95">
                      Read <ArrowRight size={13} />
                    </button>
                  </Link>
                  <div className="text-right">
                    <p className="text-white/70 text-xs font-medium mb-0.5">Engagement</p>
                    <p className="text-white/35 text-xs">{current.views} views</p>
                  </div>
                </div>
              </div>

              {/* Right */}
              <div onClick={next} className="hidden sm:block cursor-pointer flex-shrink-0 transition-all duration-500 opacity-35 hover:opacity-55 scale-90 hover:scale-[0.93]"
                style={{ width: 210 }}>
                <MeshCard card={CARDS[rightIdx]} style={CARD_STYLES[rightIdx % CARD_STYLES.length]} size="sm" />
              </div>
            </div>

            {/* Next */}
            <button onClick={next}
              className="flex-shrink-0 z-20 ml-3 md:ml-6 w-11 h-11 rounded-2xl bg-white/8 hover:bg-white/15 border border-white/10 flex items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-95 group">
              <ArrowRight size={18} className="text-white/50 group-hover:text-white transition-colors" />
            </button>
          </div>

          {/* Dots */}
          <div className="flex items-center gap-2 mt-10">
            {CARDS.map((_, i) => (
              <button key={i} onClick={() => setActive(i)}
                className={`rounded-full transition-all duration-300 cursor-pointer ${
                  i === active ? "w-7 h-2 bg-white" : "w-2 h-2 bg-white/20 hover:bg-white/40"
                }`} />
            ))}
          </div>

          {/* Article index list */}
          <div className="mt-12 w-full max-w-lg">
            <p className="text-white/25 text-xs font-semibold uppercase tracking-widest mb-4 text-center">All Articles</p>
            <div className="flex flex-col gap-1">
              {CARDS.map((c, i) => (
                <button key={c.id} onClick={() => setActive(i)}
                  className={`flex items-center justify-between px-4 py-3 rounded-2xl cursor-pointer transition-all ${
                    i === active
                      ? "bg-white/10 border border-white/15"
                      : "hover:bg-white/5 border border-transparent"
                  }`}>
                  <div className="flex items-center gap-3">
                    <span className="text-white/25 text-xs w-5 text-right font-mono">#{i+1}</span>
                    <span className={`text-sm font-medium text-left ${i === active ? "text-white" : "text-white/45"}`}>{c.title}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                    <span className="text-white/25 text-xs">{c.views}</span>
                    <div className="flex items-center gap-0.5">
                      <Star size={9} fill="#F97316" className="text-[#F97316]" />
                      <span className="text-white/35 text-xs">{c.rating}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
