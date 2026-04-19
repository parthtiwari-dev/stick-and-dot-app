"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import AppLayout from "@/components/AppLayout";
import Link from "next/link";
import { Search, ArrowLeft, ArrowRight, Clock, DollarSign, X } from "lucide-react";
import { MESH_STYLES } from "@/components/ui/MeshCard";

/* ─── Shared data ─── */
const ARTICLE_CARDS = [
  { id:"1", title:"The Silent Revolution in Neural Computing", author:"Arthur Black",  mins:"8",  tag:"Technology", keywords:["technology","neural","AI","tech"],        excerpt:"A deep dive into how neural computing is reshaping the boundaries of what machines can perceive, learn, and decide." },
  { id:"2", title:"How Minimalism Took Over the Design World", author:"Shaivya Saini", mins:"5",  tag:"Design",     keywords:["design","minimalism","culture","aesthetic"],  excerpt:"From Dieter Rams to Jony Ive — the minimalist impulse has remade how we think about objects, interfaces, and space." },
  { id:"3", title:"The Hidden Economics of Attention",         author:"Jerome Bell",   mins:"12", tag:"Finance",    keywords:["finance","economics","attention","business"],  excerpt:"Every second of your focus is worth money to someone. This unpacks the invisible market for human attention." },
  { id:"4", title:"Why Slow Reading Is Making a Comeback",     author:"Priya Mehta",   mins:"6",  tag:"Culture",    keywords:["culture","reading","learning","career"],        excerpt:"In an age of endless scroll, a quiet movement is pushing back — favouring depth over speed." },
  { id:"5", title:"Building Products People Actually Love",    author:"Arthur Black",  mins:"9",  tag:"Business",   keywords:["business","product","startups","growth"],       excerpt:"Most products are built by people guessing what users want. The ones that last went and found out." },
];

const COMMISSIONS = [
  { id:"C-001", title:"The Future of EVs in India",            business:"GreenMiles Co.",  tag:"Technology", payment:"₹4,500", deadline:"Apr 20", wordCount:1500, keywords:["technology","EV","energy"],      excerpt:"In-depth article on EV adoption in India — policy landscape, infrastructure challenges, and consumer mindset." },
  { id:"C-002", title:"Top 10 Finance Hacks for Gen-Z",        business:"MoneyMind Media", tag:"Finance",    payment:"₹3,200", deadline:"Apr 24", wordCount:1200, keywords:["finance","gen-z","money"],       excerpt:"Practical, research-backed financial strategies tailored to Gen-Z workers entering the workforce." },
  { id:"C-003", title:"AI in Healthcare: What Doctors Think",  business:"MedScope Inc.",   tag:"Medical",    payment:"₹6,000", deadline:"Apr 30", wordCount:2000, keywords:["medical","AI","healthcare"],     excerpt:"Interview-based article capturing physician perspectives on AI diagnostic tools in Indian hospitals." },
  { id:"C-004", title:"Sustainable Fashion on a Budget",       business:"TrendLoop",       tag:"Business",   payment:"₹2,800", deadline:"May 5",  wordCount:1000, keywords:["business","fashion","lifestyle"], excerpt:"Affordable sustainable fashion alternatives — brands, second-hand markets, and mindful shopping." },
  { id:"C-005", title:"Quantum Computing for Non-Engineers",   business:"TechPulse India", tag:"Technology", payment:"₹5,400", deadline:"May 8",  wordCount:1800, keywords:["technology","quantum","science"],  excerpt:"A beginner-friendly explainer on quantum computing and what it means for everyday people." },
  { id:"C-006", title:"Mental Health in Corporate India 2025", business:"WellAtWork Co.",  tag:"Business",   payment:"₹4,200", deadline:"May 12", wordCount:1400, keywords:["business","health","workplace"],  excerpt:"Data-driven article on burnout and what leading Indian companies are doing differently." },
];

const ARTICLE_TAGS    = ["#technology","#design","#finance","#culture","#business"];
const COMMISSION_TAGS = ["#technology","#finance","#medical","#business","#science"];

type Tab = "articles" | "commissions";

/* ─── Inline MeshCard (local, avoids server-component issues with Next Link inside) ─── */
function MeshCard({ title, author, tag, mins, payment, size, styleIndex, href, onClick }:{
  title:string; author?:string; tag?:string; mins?:string; payment?:string;
  size:"lg"|"sm"; styleIndex:number; href?:string; onClick?:()=>void;
}) {
  const s = MESH_STYLES[styleIndex % MESH_STYLES.length];
  const h = size === "lg" ? 380 : 290;
  const wrap = (children: React.ReactNode) =>
    href ? <Link href={href} className="block">{children}</Link> :
    onClick ? <div onClick={onClick} className="cursor-pointer">{children}</div> :
    <div>{children}</div>;

  return wrap(
    <div className="relative rounded-3xl overflow-hidden select-none" style={{ height:h, background:s.bg }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute rounded-full opacity-40 blur-3xl" style={{ width:220,height:220,background:s.blob1,top:-60,left:-40 }} />
        <div className="absolute rounded-full opacity-30 blur-3xl" style={{ width:180,height:180,background:s.blob2,bottom:20,right:-30 }} />
        <div className="absolute rounded-full opacity-20 blur-2xl" style={{ width:140,height:140,background:s.blob3,top:"40%",left:"40%" }} />
      </div>
      <div className="absolute top-4 left-4 right-4 flex items-start justify-between gap-2 z-10">
        {tag && <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white/80 text-xs px-3 py-1 rounded-full">{tag}</span>}
        {size === "lg" && mins && (
          <span className="flex items-center gap-1 bg-white/10 backdrop-blur-md border border-white/20 text-white/70 text-xs px-3 py-1.5 rounded-full flex-shrink-0">
            <Clock size={10}/>{mins} min
          </span>
        )}
        {size === "lg" && payment && (
          <span className="flex items-center gap-1 bg-white/10 backdrop-blur-md border border-white/20 text-white/80 text-xs px-3 py-1.5 rounded-full font-semibold flex-shrink-0">
            <DollarSign size={9}/>{payment}
          </span>
        )}
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-5 z-10" style={{ background:"linear-gradient(to top,rgba(0,0,0,0.65) 0%,transparent 100%)" }}>
        <h3 className={`text-white font-bold leading-snug mb-2 ${size==="lg"?"text-xl":"text-base"} line-clamp-2`}>{title}</h3>
        {author && (
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white text-[10px] font-bold">{author[0]}</div>
            <span className="text-white/60 text-xs truncate">{author}</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Generic carousel ─── */
function Carousel<T extends { id:string; title:string; tag:string; keywords:string[]; excerpt:string }>({
  cards, tags, renderMins, renderPayment, renderAuthor, renderBelow, articleHref,
}:{
  cards: T[];
  tags: string[];
  renderMins?: (c:T) => string | undefined;
  renderPayment?: (c:T) => string | undefined;
  renderAuthor?: (c:T) => string | undefined;
  renderBelow: (focused:T, idx:number) => React.ReactNode;
  articleHref?: (c:T) => string;
}) {
  const [query, setQuery]       = useState("");
  const [activeTag, setActiveTag] = useState("");
  const [active, setActive]     = useState(0);

  const filtered = useMemo(() => {
    let cs = cards;
    if (activeTag) { const t = activeTag.replace("#","").toLowerCase(); cs = cs.filter(c => c.tag.toLowerCase().includes(t) || c.keywords.some(k=>k.includes(t))); }
    if (query.trim()) { const q = query.toLowerCase(); cs = cs.filter(c => c.title.toLowerCase().includes(q) || (renderAuthor?.(c)||"").toLowerCase().includes(q) || c.tag.toLowerCase().includes(q)); }
    return cs.length > 0 ? cs : cards;
  }, [query, activeTag, cards]);

  useEffect(() => { setActive(0); }, [filtered]);
  const prev = useCallback(() => setActive(i => (i-1+filtered.length)%filtered.length), [filtered.length]);
  const next = useCallback(() => setActive(i => (i+1)%filtered.length), [filtered.length]);
  const safe = Math.min(active, filtered.length-1);
  const leftIdx  = (safe-1+filtered.length)%filtered.length;
  const rightIdx = (safe+1)%filtered.length;
  const focused  = filtered[safe];

  return (
    <div className="flex flex-col min-h-screen bg-[#0d0d0d]">
      <div className="flex flex-col items-center px-6 pt-8 pb-4">
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-5 py-3 w-full max-w-lg mb-4">
          <Search size={14} className="text-white/30 flex-shrink-0"/>
          <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search…" className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/25"/>
          {query && <button onClick={()=>setQuery("")} className="text-white/30 hover:text-white/60 cursor-pointer"><X size={13}/></button>}
        </div>
        <div className="flex flex-wrap justify-center gap-2 mb-2">
          {tags.map(t=>(
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
            {filtered.length > 1 && (
              <div onClick={prev} className="hidden sm:block cursor-pointer transition-all duration-500 opacity-40 hover:opacity-60 scale-90 hover:scale-95 flex-shrink-0" style={{ width:220 }}>
                <MeshCard title={filtered[leftIdx].title} tag={filtered[leftIdx].tag} author={renderAuthor?.(filtered[leftIdx])} mins={renderMins?.(filtered[leftIdx])} payment={renderPayment?.(filtered[leftIdx])} size="sm" styleIndex={leftIdx} />
              </div>
            )}
            <div className="flex-shrink-0 transition-all duration-500" style={{ width:"min(360px,90vw)" }}>
              <div className="transition-all duration-500 hover:scale-[1.02] shadow-2xl" style={{ filter:"drop-shadow(0 0 40px rgba(255,255,255,0.07))" }}>
                <MeshCard title={focused.title} tag={focused.tag} author={renderAuthor?.(focused)} mins={renderMins?.(focused)} payment={renderPayment?.(focused)} size="lg" styleIndex={safe} href={articleHref?.(focused)} />
              </div>
              <div className="mt-5 text-center px-2">{renderBelow(focused, safe)}</div>
            </div>
            {filtered.length > 1 && (
              <div onClick={next} className="hidden sm:block cursor-pointer transition-all duration-500 opacity-40 hover:opacity-60 scale-90 hover:scale-95 flex-shrink-0" style={{ width:220 }}>
                <MeshCard title={filtered[rightIdx].title} tag={filtered[rightIdx].tag} author={renderAuthor?.(filtered[rightIdx])} mins={renderMins?.(filtered[rightIdx])} payment={renderPayment?.(filtered[rightIdx])} size="sm" styleIndex={rightIdx} />
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
  );
}

export default function WriterExplorePage() {
  const [tab, setTab] = useState<Tab>("articles");
  const [accepted, setAccepted] = useState<string[]>([]);

  return (
    <AppLayout bg="bg-[#0d0d0d]">
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <div className="px-6 pt-8 pb-2 text-center">
          <h1 className="text-white text-2xl font-bold mb-1">
            {tab === "articles" ? "Explore" : "Open Commissions"}
          </h1>
          <p className="text-white/40 text-sm mb-5">
            {tab === "articles" ? "Read what's published on the platform" : "Browse commissions — accept what interests you, no obligation"}
          </p>
          {/* Tab toggle */}
          <div className="inline-flex bg-white/5 border border-white/10 rounded-2xl p-1 gap-1 mb-2">
            {(["articles","commissions"] as Tab[]).map(t=>(
              <button key={t} onClick={()=>setTab(t)}
                className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer capitalize ${tab===t?"bg-white text-black":"text-white/50 hover:text-white/80"}`}>
                {t === "articles" ? "Browse Articles" : "Commissions"}
              </button>
            ))}
          </div>
        </div>

        {tab === "articles" ? (
          <Carousel
            cards={ARTICLE_CARDS}
            tags={ARTICLE_TAGS}
            renderMins={c => c.mins}
            renderAuthor={c => c.author}
            articleHref={c => `/articles/${c.id}`}
            renderBelow={(focused) => (
              <>
                <p className="text-white/45 text-sm leading-relaxed mb-5">{focused.excerpt}</p>
                <Link href={`/articles/${focused.id}`} className="inline-flex items-center gap-2 bg-white text-black text-sm font-bold px-7 py-3 rounded-2xl hover:bg-white/90 transition-all hover:scale-[1.03] active:scale-95">
                  Read Now <ArrowRight size={14}/>
                </Link>
              </>
            )}
          />
        ) : (
          <Carousel
            cards={COMMISSIONS}
            tags={COMMISSION_TAGS}
            renderPayment={c => c.payment}
            renderAuthor={c => c.business}
            renderBelow={(focused) => {
              const isAccepted = accepted.includes(focused.id);
              return (
                <>
                  <div className="flex items-center justify-center gap-4 mb-3 text-xs text-white/40">
                    <span className="flex items-center gap-1"><Clock size={11}/> Due {focused.deadline}</span>
                    <span>·</span>
                    <span>{focused.wordCount.toLocaleString()} words</span>
                  </div>
                  <p className="text-white/45 text-sm leading-relaxed mb-5">{focused.excerpt}</p>
                  {isAccepted ? (
                    <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 text-green-400 text-sm font-bold px-7 py-3 rounded-2xl">
                      ✓ Commission Accepted
                    </div>
                  ) : (
                    <button onClick={() => setAccepted(p=>[...p,focused.id])}
                      className="inline-flex items-center gap-2 bg-white text-black text-sm font-bold px-7 py-3 rounded-2xl hover:bg-white/90 transition-all cursor-pointer hover:scale-[1.03] active:scale-95">
                      Accept Commission <ArrowRight size={14}/>
                    </button>
                  )}
                </>
              );
            }}
          />
        )}
      </div>
    </AppLayout>
  );
}
