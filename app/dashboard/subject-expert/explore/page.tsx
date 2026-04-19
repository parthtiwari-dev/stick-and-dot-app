"use client";
import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import Link from "next/link";
import { Search, CheckCircle } from "lucide-react";
import MeshCard from "@/components/ui/MeshCard";

const DOMAINS = ["All","Technology","Finance","Medical","Science","Law","Business","Education"];

type CardStatus = "published" | "pending-review";

interface Article {
  id: string;
  title: string;
  author: string;
  domain: string;
  mins: number;
  date: string;
  status: CardStatus;
}

const FEED: Article[] = [
  { id:"ART-0041", title:"The Future of EVs in India",               author:"Ravi M.",   domain:"Technology", mins:8,  date:"Apr 10", status:"pending-review" },
  { id:"ART-0051", title:"Understanding mRNA Vaccine Technology",     author:"Priya K.",  domain:"Medical",    mins:12, date:"Apr 11", status:"published"      },
  { id:"ART-0042", title:"Top Finance Hacks for Gen-Z",              author:"Neha S.",   domain:"Finance",    mins:6,  date:"Apr 10", status:"pending-review" },
  { id:"ART-0052", title:"Quantum Cryptography and Data Security",   author:"Aman G.",   domain:"Technology", mins:10, date:"Apr 9",  status:"published"      },
  { id:"ART-0043", title:"AI in Healthcare: What Doctors Say",       author:"Priya K.",  domain:"Medical",    mins:9,  date:"Apr 9",  status:"pending-review" },
  { id:"ART-0053", title:"Climate Finance and Green Bonds in 2025",  author:"Jerome B.", domain:"Finance",    mins:7,  date:"Apr 8",  status:"published"      },
  { id:"ART-0044", title:"Sustainable Fashion on a Budget",          author:"Sara T.",   domain:"Business",   mins:5,  date:"Apr 8",  status:"pending-review" },
  { id:"ART-0054", title:"CRISPR Gene Editing — Current State",      author:"Arthur B.", domain:"Science",    mins:14, date:"Apr 7",  status:"published"      },
];

export default function SMEExplorePage() {
  const [search, setSearch]       = useState("");
  const [domain, setDomain]       = useState("All");
  const [reviewing, setReviewing] = useState<string[]>([]);

  const filtered = FEED.filter(a => {
    const matchDomain = domain === "All" || a.domain === domain;
    const matchSearch = !search.trim() ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.author.toLowerCase().includes(search.toLowerCase()) ||
      a.domain.toLowerCase().includes(search.toLowerCase());
    return matchDomain && matchSearch;
  });

  const startReview = (id: string) => setReviewing(p => [...p, id]);

  const pendingCount   = filtered.filter(a => a.status === "pending-review").length;
  const publishedCount = filtered.filter(a => a.status === "published").length;

  return (
    <AppLayout bg="bg-[#0d0d0d]">
      <div className="p-4 md:p-6 min-h-screen">

        {/* Header */}
        <div className="mb-6">
          <p className="text-xs text-white/30 mb-0.5">
            <Link href="/dashboard/subject-expert" className="hover:text-white/60">Dashboard</Link>&gt;Explore
          </p>
          <h1 className="text-2xl md:text-3xl font-black text-white">Explore Your Domain</h1>
          <p className="text-sm text-white/40 mt-0.5">Your field's content feed — read published articles or optionally review pending ones. Your choice entirely.</p>
        </div>

        {/* Search + Domain Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 flex-1 max-w-md">
            <Search size={14} className="text-white/30 flex-shrink-0"/>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search articles, authors, topics…"
              className="flex-1 text-sm text-white outline-none placeholder:text-white/25 bg-transparent"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {DOMAINS.map(d => (
              <button key={d} onClick={() => setDomain(d)}
                className={`text-xs px-3 py-2 rounded-xl border font-medium transition-all cursor-pointer ${
                  domain === d
                    ? "bg-white text-black border-white"
                    : "bg-white/5 text-white/50 border-white/10 hover:bg-white/10 hover:text-white/80"
                }`}>{d}</button>
            ))}
          </div>
        </div>

        {/* Stats bar */}
        <div className="flex items-center gap-6 mb-6">
          <div className="flex items-center gap-2 text-xs text-white/40">
            <div className="w-2 h-2 rounded-full bg-green-400"/>
            <span>{publishedCount} Published</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-white/40">
            <div className="w-2 h-2 rounded-full bg-orange-400"/>
            <span>{pendingCount} Pending Review</span>
          </div>
          {reviewing.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-white/40">
              <CheckCircle size={12} className="text-blue-400"/>
              <span>{reviewing.length} you&apos;re reviewing</span>
            </div>
          )}
        </div>

        {/* MeshCard grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((article, i) => {
            const isPending   = article.status === "pending-review";
            const isReviewing = reviewing.includes(article.id);

            const badge       = isPending ? "Needs Review" : undefined;
            const badgeColor  = isPending ? "orange" as const : "green" as const;
            const actionLabel = isPending
              ? isReviewing ? "✓ Reviewing" : "Start Review"
              : "Read Article";

            return (
              <div key={article.id}>
                <MeshCard
                  title={article.title}
                  author={article.author}
                  tag={article.domain}
                  mins={article.mins}
                  badge={badge}
                  badgeColor={badgeColor}
                  styleIndex={i}
                  height={240}
                  actionLabel={actionLabel}
                  onAction={() => {
                    if (isPending && !isReviewing) startReview(article.id);
                    else if (!isPending) window.location.href = `/articles/${article.id}`;
                  }}
                />
                <p className="text-xs text-white/25 mt-2 px-1">{article.date} · {article.id}</p>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="rounded-2xl border border-white/10 p-12 text-center">
            <p className="text-white/30 text-sm">No articles found for your filters.</p>
          </div>
        )}

      </div>
    </AppLayout>
  );
}
