"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import AppLayout from "@/components/AppLayout";
import Link from "next/link";
import { Search, ArrowLeft, ArrowRight, X, Edit2 } from "lucide-react";
import { useUser } from "@/components/UserContext";
import { MESH_STYLES } from "@/components/ui/MeshCard";

const ARTICLES = [
  { id:"a1", title:"The Silent Revolution in Neural Computing", author:"You", tag:"Technology", mins:"8",  excerpt:"A deep dive into how neural computing is reshaping the boundaries of what machines can perceive, learn, and decide.", keywords:["technology","neural","AI"] },
  { id:"a2", title:"How Minimalism Took Over the Design World", author:"You", tag:"Design",     mins:"5",  excerpt:"From Dieter Rams to Jony Ive — the minimalist impulse has remade how we think about objects and interfaces.", keywords:["design","minimalism","culture"] },
  { id:"a3", title:"The Hidden Economics of Attention",         author:"You", tag:"Finance",    mins:"12", excerpt:"Every second of your focus is worth money to someone. This unpacks the invisible market for human attention.", keywords:["finance","economics","attention"] },
  { id:"a4", title:"Why Slow Reading Is Making a Comeback",     author:"You", tag:"Culture",    mins:"6",  excerpt:"In an age of endless scroll, a quiet movement is pushing back — favouring depth over speed.", keywords:["culture","reading","career"] },
  { id:"a5", title:"Building Products People Actually Love",    author:"You", tag:"Business",   mins:"9",  excerpt:"Most products are built by people guessing what users want. The ones that last went and found out.", keywords:["business","product","startups"] },
];
const TAGS = ["#technology","#design","#finance","#culture","#business"];

function MeshCard({ title, tag, mins, size, styleIndex, href }:{
  title:string; tag:string; mins:string; size:"lg"|"sm"; styleIndex:number; href:string;
}) {
  const s = MESH_STYLES[styleIndex % MESH_STYLES.length];
  const h = size==="lg"?380:290;
  return (
    <Link href={href} className="block hover:opacity-90 transition-opacity">
      <div className="relative rounded-3xl overflow-hidden select-none" style={{ height:h, background:s.bg }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute rounded-full opacity-40 blur-3xl" style={{ width:220,height:220,background:s.blob1,top:-60,left:-40 }} />
          <div className="absolute rounded-full opacity-30 blur-3xl" style={{ width:180,height:180,background:s.blob2,bottom:20,right:-30 }} />
          <div className="absolute rounded-full opacity-20 blur-2xl" style={{ width:140,height:140,background:s.blob3,top:"40%",left:"40%" }} />
        </div>
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white/80 text-xs px-3 py-1 rounded-full">{tag}</span>
          {size==="lg" && <span className="text-white/60 text-xs bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full">{mins} min</span>}
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-5 z-10" style={{ background:"linear-gradient(to top,rgba(0,0,0,0.65) 0%,transparent 100%)" }}>
          <h3 className={`text-white font-bold leading-snug mb-1 ${size==="lg"?"text-xl":"text-base"} line-clamp-2`}>{title}</h3>
          <span className="text-white/40 text-xs">Your article · Click to read</span>
        </div>
      </div>
    </Link>
  );
}

export default function WriterPortfolioPage() {
  const { userName } = useUser();
  const [query, setQuery]       = useState("");
  const [activeTag, setActiveTag] = useState("");
  const [active, setActive]     = useState(0);

  const filtered = useMemo(() => {
    let cs = ARTICLES;
    if (activeTag) { const t=activeTag.replace("#","").toLowerCase(); cs=cs.filter(c=>c.tag.toLowerCase().includes(t)||c.keywords.some(k=>k.includes(t))); }
    if (query.trim()) { const q=query.toLowerCase(); cs=cs.filter(c=>c.title.toLowerCase().includes(q)||c.tag.toLowerCase().includes(q)); }
    return cs.length>0?cs:ARTICLES;
  }, [query, activeTag]);

  useEffect(()=>{setActive(0);},[filtered]);
  const prev = useCallback(()=>setActive(i=>(i-1+filtered.length)%filtered.length),[filtered.length]);
  const next = useCallback(()=>setActive(i=>(i+1)%filtered.length),[filtered.length]);
  const safe=Math.min(active,filtered.length-1);
  const leftIdx=(safe-1+filtered.length)%filtered.length;
  const rightIdx=(safe+1)%filtered.length;
  const focused=filtered[safe];

  return (
    <AppLayout bg="bg-[#0d0d0d]">
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <div className="px-6 pt-8 pb-4 flex items-center justify-between">
          <div>
            <p className="text-white/30 text-xs mb-0.5">Dashboard &gt; Portfolio</p>
            <h1 className="text-white text-2xl font-bold">My Portfolio</h1>
            <p className="text-white/40 text-sm mt-0.5">{userName} · {ARTICLES.length} published articles</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/writer/settings">
              <button className="flex items-center gap-2 border border-white/15 text-white/60 hover:text-white text-xs px-4 py-2.5 rounded-xl transition-colors cursor-pointer hover:border-white/30">
                <Edit2 size={13}/> Edit Profile
              </button>
            </Link>
            <Link href="/dashboard/writer/create">
              <button className="bg-white text-black text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-white/90 transition-colors cursor-pointer">
                + New Article
              </button>
            </Link>
          </div>
        </div>

        {/* Search + tags */}
        <div className="flex flex-col items-center px-6 pb-4">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-5 py-3 w-full max-w-lg mb-3">
            <Search size={14} className="text-white/30 flex-shrink-0"/>
            <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search your articles…" className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/25"/>
            {query&&<button onClick={()=>setQuery("")} className="text-white/30 hover:text-white/60 cursor-pointer"><X size={13}/></button>}
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {TAGS.map(t=>(
              <button key={t} onClick={()=>setActiveTag(activeTag===t?"":t)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium border cursor-pointer transition-all ${activeTag===t?"bg-white text-black border-white":"bg-white/5 text-white/50 border-white/10 hover:bg-white/10 hover:text-white/80"}`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Carousel */}
        <div className="flex-1 flex flex-col items-center pb-10 px-4">
          <div className="relative w-full flex items-center justify-center">
            <button onClick={prev} className="flex-shrink-0 z-20 mr-3 md:mr-5 w-11 h-11 rounded-2xl bg-white/8 hover:bg-white/15 border border-white/10 flex items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-95 group">
              <ArrowLeft size={18} className="text-white/60 group-hover:text-white"/>
            </button>
            <div className="flex items-center gap-4 md:gap-6 justify-center overflow-visible">
              {filtered.length>1&&(
                <div onClick={prev} className="hidden sm:block cursor-pointer transition-all duration-500 opacity-40 hover:opacity-60 scale-90 hover:scale-95 flex-shrink-0" style={{ width:220 }}>
                  <MeshCard title={filtered[leftIdx].title} tag={filtered[leftIdx].tag} mins={filtered[leftIdx].mins} size="sm" styleIndex={leftIdx} href={`/articles/${filtered[leftIdx].id}`}/>
                </div>
              )}
              <div className="flex-shrink-0 transition-all duration-500" style={{ width:"min(360px,90vw)" }}>
                <div className="transition-all duration-500 hover:scale-[1.02] shadow-2xl" style={{ filter:"drop-shadow(0 0 40px rgba(255,255,255,0.07))" }}>
                  <MeshCard title={focused.title} tag={focused.tag} mins={focused.mins} size="lg" styleIndex={safe} href={`/articles/${focused.id}`}/>
                </div>
                <div className="mt-5 text-center px-2">
                  <p className="text-white/45 text-sm leading-relaxed mb-5">{focused.excerpt}</p>
                  <Link href={`/articles/${focused.id}`} className="inline-flex items-center gap-2 bg-white text-black text-sm font-bold px-7 py-3 rounded-2xl hover:bg-white/90 transition-all hover:scale-[1.03] active:scale-95">
                    Read Article <ArrowRight size={14}/>
                  </Link>
                </div>
              </div>
              {filtered.length>1&&(
                <div onClick={next} className="hidden sm:block cursor-pointer transition-all duration-500 opacity-40 hover:opacity-60 scale-90 hover:scale-95 flex-shrink-0" style={{ width:220 }}>
                  <MeshCard title={filtered[rightIdx].title} tag={filtered[rightIdx].tag} mins={filtered[rightIdx].mins} size="sm" styleIndex={rightIdx} href={`/articles/${filtered[rightIdx].id}`}/>
                </div>
              )}
            </div>
            <button onClick={next} className="flex-shrink-0 z-20 ml-3 md:ml-5 w-11 h-11 rounded-2xl bg-white/8 hover:bg-white/15 border border-white/10 flex items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-95 group">
              <ArrowRight size={18} className="text-white/60 group-hover:text-white"/>
            </button>
          </div>
          <div className="flex items-center gap-2 mt-8">
            {filtered.map((_,i)=>(
              <button key={i} onClick={()=>setActive(i)} className={`rounded-full transition-all duration-300 cursor-pointer ${i===safe?"w-7 h-2 bg-white":"w-2 h-2 bg-white/20 hover:bg-white/40"}`}/>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
