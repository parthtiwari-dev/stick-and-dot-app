"use client";
import { useEffect, useState } from "react";
import AppLayout from "@/components/AppLayout";
import LightCard from "@/components/ui/LightCard";
import Link from "next/link";
import { Search, ChevronRight } from "lucide-react";
import { dashRootPath } from "@/lib/roles";
import { formatReadTime, listPublishedArticles } from "@/lib/supabase/articles";
import { applyToCommission, formatDueDate, formatMoney, listOpenCommissions } from "@/lib/supabase/commissions";

const TABS = ["Articles", "Open Commissions"];
const TAGS = ["All", "#Technology", "#Finance", "#Medical", "#Science", "#Design", "#Career"];

type ExploreArticle = { id: string; slug: string; title: string; author: string; tags: string[]; readTime: string };
type ExploreCommission = { id: string; title: string; budget: string; deadline: string; domain: string };

const FALLBACK_ARTICLES: ExploreArticle[] = [
  { id:"1", slug:"1", title:"The Silent Revolution in Neural Computing",      author:"Aisha R.",  tags:["#technology","#AI"],       readTime:"8 min"  },
  { id:"2", slug:"2", title:"How Minimalism Took Over the Design World",      author:"Ravi M.",   tags:["#design","#culture"],      readTime:"6 min"  },
  { id:"3", slug:"3", title:"The Hidden Economics of Attention",              author:"Priya K.",  tags:["#finance","#psychology"],  readTime:"10 min" },
  { id:"4", slug:"4", title:"Why Great Ideas Die in Meetings",                author:"Sara T.",   tags:["#career","#productivity"], readTime:"5 min"  },
  { id:"5", slug:"5", title:"Building Systems That Last",                     author:"Aman G.",   tags:["#technology","#career"],   readTime:"7 min"  },
  { id:"6", slug:"6", title:"The Attention Economy and What It Costs Us",     author:"Neha S.",   tags:["#AI","#society"],          readTime:"9 min"  },
];

const FALLBACK_COMMISSIONS: ExploreCommission[] = [
  { id:"c1", title:"3000-word piece on EV Infrastructure in India", budget:"INR 8,000",  deadline:"Apr 30", domain:"Technology" },
  { id:"c2", title:"Finance Guide for First-Time Investors",        budget:"INR 6,500",  deadline:"May 5",  domain:"Finance"    },
  { id:"c3", title:"AI in Healthcare: Patient Perspective",         budget:"INR 10,000", deadline:"May 10", domain:"Medical"    },
];

const CARDS_PER_LOAD = 6;

export default function WriterExplorePage() {
  const [tab, setTab]                   = useState("Articles");
  const [activeTag, setActiveTag]       = useState("All");
  const [search, setSearch]             = useState("");
  const [visibleCount, setVisibleCount] = useState(CARDS_PER_LOAD);
  const [articles, setArticles] = useState<ExploreArticle[]>(FALLBACK_ARTICLES);
  const [commissions, setCommissions] = useState<ExploreCommission[]>(FALLBACK_COMMISSIONS);
  const [applied, setApplied] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let alive = true;

    listPublishedArticles()
      .then(rows => {
        if (!alive || rows.length === 0) return;
        setArticles(rows.map(row => ({
          id: row.id,
          slug: row.slug,
          title: row.title,
          author: row.author_name,
          tags: row.tags.length ? row.tags : [`#${row.domain_name}`],
          readTime: formatReadTime(row.read_time_minutes),
        })));
      })
      .catch(() => {});

    listOpenCommissions()
      .then(rows => {
        if (!alive || rows.length === 0) return;
        setCommissions(rows.map(row => ({
          id: row.id,
          title: row.topic,
          budget: formatMoney(row.payment_amount, row.payment_currency),
          deadline: formatDueDate(row.due_date),
          domain: row.domain_name,
        })));
      })
      .catch(() => {});

    return () => {
      alive = false;
    };
  }, []);

  const filteredArticles = articles
    .filter(a => activeTag === "All" || a.tags.some(t => t.toLowerCase() === activeTag.toLowerCase()))
    .filter(a => !search || a.title.toLowerCase().includes(search.toLowerCase()));

  const visibleArticles  = filteredArticles.slice(0, visibleCount);
  const hasMoreArticles  = visibleCount < filteredArticles.length;

  const visibleCommissions = commissions.slice(0, visibleCount);
  const hasMoreCommissions = visibleCount < commissions.length;

  const resetVisible = () => setVisibleCount(CARDS_PER_LOAD);

  return (
    <AppLayout bg="bg-white">
      <div className="min-h-screen px-6 md:px-10 py-10">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
          <div>
            <nav className="flex items-center gap-1 mb-1" aria-label="Breadcrumb">
              <Link
                href={dashRootPath("Writer")}
                className="text-xs text-[#6b7280] hover:text-[#0a0a0a] transition-colors"
              >
                Dashboard
              </Link>
              <ChevronRight size={12} className="text-[#9ca3af]" />
              <span className="text-xs text-[#0a0a0a] font-medium">Explore</span>
            </nav>
            <h1 className="text-2xl md:text-3xl font-bold text-[#0a0a0a]">Explore</h1>
            <p className="text-sm text-[#6b7280] mt-1">Discover articles and commissions</p>
          </div>
          <div className="flex items-center gap-2 bg-white border border-[#e5e7eb] rounded-lg px-4 py-2.5 w-full sm:w-64">
            <Search size={13} className="text-[#9ca3af] flex-shrink-0" />
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={e => { setSearch(e.target.value); resetVisible(); }}
              className="bg-transparent text-sm text-[#0a0a0a] outline-none flex-1 placeholder:text-[#9ca3af]"
            />
          </div>
        </div>

        <div className="flex border-b border-[#e5e7eb] mb-7">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); resetVisible(); }}
              className={`text-sm font-medium px-4 py-2.5 transition-colors cursor-pointer ${
                tab === t
                  ? "text-[#0a0a0a] border-b-2 border-[#0a0a0a] -mb-px"
                  : "text-[#6b7280] hover:text-[#0a0a0a]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "Articles" && (
          <>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 mb-6">
              {TAGS.map(tag => (
                <button
                  key={tag}
                  onClick={() => { setActiveTag(tag); resetVisible(); }}
                  aria-pressed={activeTag === tag}
                  className={`flex-shrink-0 text-xs px-4 py-1.5 rounded-full font-medium transition-all duration-200 cursor-pointer ${
                    activeTag === tag
                      ? "bg-[#0a0a0a] text-white"
                      : "bg-[#f3f4f6] text-[#374151] hover:bg-[#e5e7eb]"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {filteredArticles.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-[#6b7280] text-base">No articles found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {visibleArticles.map(a => (
                  <LightCard
                    key={a.id}
                    size="lg"
                    title={a.title}
                    author={a.author}
                    tags={a.tags}
                    readTime={a.readTime}
                    href={`/articles/${a.slug}`}
                  />
                ))}
              </div>
            )}

            {hasMoreArticles && (
              <button
                onClick={() => setVisibleCount(c => c + CARDS_PER_LOAD)}
                className="w-full border border-[#e5e7eb] rounded-[8px] bg-white text-[#0a0a0a] text-sm font-medium py-3 hover:bg-[#f9fafb] transition-colors cursor-pointer"
              >
                Load more articles
              </button>
            )}
          </>
        )}

        {tab === "Open Commissions" && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {visibleCommissions.map(c => (
                <div
                  key={c.id}
                  className="bg-white border border-[#e5e7eb] rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.06)]
                             hover:shadow-[0_4px_12px_rgba(0,0,0,0.10)] hover:-translate-y-0.5
                             transition-all duration-200 p-5 flex flex-col min-h-[200px]"
                >
                  <span className="self-start text-[10px] bg-[#f3f4f6] text-[#374151] px-2.5 py-1 rounded-full mb-3">
                    {c.domain}
                  </span>

                  <p className="text-sm font-semibold text-[#0a0a0a] line-clamp-2 flex-1 mb-4">{c.title}</p>

                  <div className="flex items-center justify-between pt-3 border-t border-[#f3f4f6]">
                    <div>
                      <p className="text-base font-bold text-[#0a0a0a]">{c.budget}</p>
                      <p className="text-xs text-[#9ca3af] mt-0.5">Deadline: {c.deadline}</p>
                    </div>
                    <button
                      onClick={() => {
                        void applyToCommission(c.id)
                          .then(() => setApplied(prev => ({ ...prev, [c.id]: true })))
                          .catch(() => setApplied(prev => ({ ...prev, [c.id]: false })));
                      }}
                      className="bg-[#0a0a0a] text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-[#374151] transition-colors cursor-pointer"
                    >
                      {applied[c.id] ? "Applied" : "Apply"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {hasMoreCommissions && (
              <button
                onClick={() => setVisibleCount(c => c + CARDS_PER_LOAD)}
                className="w-full border border-[#e5e7eb] rounded-[8px] bg-white text-[#0a0a0a] text-sm font-medium py-3 hover:bg-[#f9fafb] transition-colors cursor-pointer"
              >
                Load more commissions
              </button>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
}
