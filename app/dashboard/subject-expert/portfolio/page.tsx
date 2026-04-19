"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import AppLayout from "@/components/AppLayout";
import Link from "next/link";
import { Search, ArrowLeft, ArrowRight, X, CheckCircle, AlertCircle } from "lucide-react";
import { useUser } from "@/components/UserContext";
import { MESH_STYLES } from "@/components/ui/MeshCard";

const REVIEWS = [
  { id:"r1", title:"AI in Healthcare 2026",      domain:"Medical",    decision:"Approved",           score:4.2, date:"10 Apr 2026", articleId:"1", summary:"Well-researched article with accurate clinical data. Minor terminology issues corrected. Approved for publication.", keywords:["medical","AI","healthcare"] },
  { id:"r2", title:"Quantum Computing Basics",   domain:"Technology", decision:"Revision Requested", score:2.8, date:"8 Apr 2026",  articleId:"2", summary:"Core concepts explained clearly but several factual errors in the section on qubit decoherence. Revision required.", keywords:["technology","quantum","computing"] },
  { id:"r3", title:"The Future of CRISPR",       domain:"Science",    decision:"Approved",           score:4.7, date:"5 Apr 2026",  articleId:"3", summary:"Excellent accuracy across all sections. The gene-editing examples were well chosen and correctly cited.", keywords:["science","biology","genetics"] },
  { id:"r4", title:"Crypto Regulations 2025",    domain:"Finance",    decision:"Approved",           score:4.5, date:"1 Apr 2026",  articleId:"4", summary:"Balanced analysis of the regulatory landscape. Minor updates to EU jurisdiction claims. Approved.", keywords:["finance","crypto","regulation"] },
  { id:"r5", title:"Mental Health at Work",      domain:"Business",   decision:"Approved",           score:4.8, date:"28 Mar 2026", articleId:"5", summary:"Sensitive topic handled with care. Statistics sourced correctly. A standout article — approved without changes.", keywords:["business","health","workplace"] },
];
const TAGS = ["#medical","#technology","#science","#finance","#business"];
const CARD_STYLES_SME = [
  { bg:"#0d1a0d", blob1:"#16a34a", blob2:"#15803d", blob3:"#4ade80" },
  { bg:"#1a0d0d", blob1:"#dc2626", blob2:"#db2777", blob3:"#f97316" },
  { bg:"#0d1f33", blob1:"#0ea5e9", blob2:"#6366f1", blob3:"#06b6d4" },
  { bg:"#1a0533", blob1:"#7c3aed", blob2:"#c026d3", blob3:"#4f46e5" },
  { bg:"#1a1a0d", blob1:"#ca8a04", blob2:"#ea580c", blob3:"#84cc16" },
];

function MeshCard({ review, size, styleIndex }:{ review:typeof REVIEWS[0]; size:"lg"|"sm"; styleIndex:number }) {
  const s = CARD_STYLES_SME[styleIndex % CARD_STYLES_SME.length];
  const h = size==="lg"?380:290;
  const approved = review.decision==="Approved";
  return (
    <Link href={`/articles/${review.articleId}`} className="block hover:opacity-90 transition-opacity">
      <div className="relative rounded-3xl overflow-hidden select-none" style={{ height:h, background:s.bg }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute rounded-full opacity-40 blur-3xl" style={{ width:220,height:220,background:s.blob1,top:-60,left:-40 }} />
          <div className="absolute rounded-full opacity-30 blur-3xl" style={{ width:180,height:180,background:s.blob2,bottom:20,right:-30 }} />
          <div className="absolute rounded-full opacity-20 blur-2xl" style={{ width:140,height:140,background:s.blob3,top:"40%",left:"40%" }} />
        </div>
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white/80 text-xs px-3 py-1 rounded-full">{review.domain}</span>
          {size==="lg"&&(
            <span className={`flex items-center gap-1 text-xs px-3 py-1 rounded-full font-semibold backdrop-blur-md border ${approved?"bg-green-500/70 border-green-400/40 text-white":"bg-orange-500/70 border-orange-400/40 text-white"}`}>
              {approved?<CheckCircle size={10}/>:<AlertCircle size={10}/>}{review.decision}
            </span>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-5 z-10" style={{ background:"linear-gradient(to top,rgba(0,0,0,0.65) 0%,transparent 100%)" }}>
          <h3 className={`text-white font-bold leading-snug mb-1 ${size==="lg"?"text-xl":"text-base"} line-clamp-2`}>{review.title}</h3>
          <div className="flex items-center justify-between">
            <span className="text-white/40 text-xs">{review.date} · Score {review.score}/5</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function SMEPortfolioPage() {
  const { userName } = useUser();
  const [query, setQuery]       = useState("");
  const [activeTag, setActiveTag] = useState("");
  const [active, setActive]     = useState(0);

  const filtered = useMemo(() => {
    let cs = REVIEWS;
    if (activeTag) { const t=activeTag.replace("#","").toLowerCase(); cs=cs.filter(c=>c.domain.toLowerCase().includes(t)||c.keywords.some(k=>k.includes(t))); }
    if (query.trim()) { const q=query.toLowerCase(); cs=cs.filter(c=>c.title.toLowerCase().includes(q)||c.domain.toLowerCase().includes(q)); }
    return cs.length>0?cs:REVIEWS;
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
        <div className="px-6 pt-8 pb-4 flex items-center justify-between">
          <div>
            <p className="text-white/30 text-xs mb-0.5">Dashboard &gt; Portfolio</p>
            <h1 className="text-white text-2xl font-bold">My Review Portfolio</h1>
            <p className="text-white/40 text-sm mt-0.5">{userName} · {REVIEWS.length} articles reviewed</p>
          </div>
        </div>
        <div className="flex flex-col items-center px-6 pb-4">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-5 py-3 w-full max-w-lg mb-3">
            <Search size={14} className="text-white/30 flex-shrink-0"/>
            <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search your reviews…" className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/25"/>
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
        <div className="flex-1 flex flex-col items-center pb-10 px-4">
          <div className="relative w-full flex items-center justify-center">
            <button onClick={prev} className="flex-shrink-0 z-20 mr-3 md:mr-5 w-11 h-11 rounded-2xl bg-white/8 hover:bg-white/15 border border-white/10 flex items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-95 group">
              <ArrowLeft size={18} className="text-white/60 group-hover:text-white"/>
            </button>
            <div className="flex items-center gap-4 md:gap-6 justify-center overflow-visible">
              {filtered.length>1&&(
                <div onClick={prev} className="hidden sm:block cursor-pointer transition-all duration-500 opacity-40 hover:opacity-60 scale-90 hover:scale-95 flex-shrink-0" style={{ width:220 }}>
                  <MeshCard review={filtered[leftIdx]} size="sm" styleIndex={leftIdx}/>
                </div>
              )}
              <div className="flex-shrink-0 transition-all duration-500" style={{ width:"min(360px,90vw)" }}>
                <div className="transition-all duration-500 hover:scale-[1.02] shadow-2xl" style={{ filter:"drop-shadow(0 0 40px rgba(255,255,255,0.07))" }}>
                  <MeshCard review={focused} size="lg" styleIndex={safe}/>
                </div>
                <div className="mt-5 text-center px-2">
                  <p className="text-white/45 text-sm leading-relaxed mb-5">{focused.summary}</p>
                  <Link href={`/articles/${focused.articleId}`} className="inline-flex items-center gap-2 bg-white text-black text-sm font-bold px-7 py-3 rounded-2xl hover:bg-white/90 transition-all hover:scale-[1.03] active:scale-95">
                    View Article <ArrowRight size={14}/>
                  </Link>
                </div>
              </div>
              {filtered.length>1&&(
                <div onClick={next} className="hidden sm:block cursor-pointer transition-all duration-500 opacity-40 hover:opacity-60 scale-90 hover:scale-95 flex-shrink-0" style={{ width:220 }}>
                  <MeshCard review={filtered[rightIdx]} size="sm" styleIndex={rightIdx}/>
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
