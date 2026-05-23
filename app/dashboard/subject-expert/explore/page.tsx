"use client";
import { useEffect, useState } from "react";
import AppLayout from "@/components/AppLayout";
import Link from "next/link";
import { Search, ChevronRight } from "lucide-react";
import { dashRootPath } from "@/lib/roles";
import { formatArticleDate, listReviewQueueArticles } from "@/lib/supabase/articles";
import { getCurrentProfile } from "@/lib/supabase/profile";

type ReviewArticle = {
  id: string;
  slug: string;
  title: string;
  domain: string;
  writer: string;
  submitted: string;
  status: "pending" | "published";
  urgency: string;
};

const FALLBACK_ARTICLES: ReviewArticle[] = [
  { id:"ART-0041", slug:"ART-0041", title:"The Future of EVs in India",               domain:"Technology", writer:"Ravi M.",   submitted:"Apr 10", status:"pending",   urgency:"high"   },
  { id:"ART-0045", slug:"ART-0045", title:"Quantum Computing Explained Simply",        domain:"Technology", writer:"Aman G.",   submitted:"Apr 7",  status:"pending",   urgency:"medium" },
  { id:"ART-0038", slug:"ART-0038", title:"The Silent Revolution in Neural Computing", domain:"Technology", writer:"Aisha R.",  submitted:"Apr 5",  status:"published", urgency:"low"    },
  { id:"ART-0036", slug:"ART-0036", title:"AI in Everyday Life",                       domain:"Technology", writer:"Dev P.",    submitted:"Apr 2",  status:"published", urgency:"low"    },
  { id:"ART-0050", slug:"ART-0050", title:"5G and Its Real-World Impact",              domain:"Technology", writer:"Meera S.",  submitted:"Mar 30", status:"pending",   urgency:"high"   },
];

const urgencyPill = (u: string) =>
  u === "high"   ? "bg-[#0a0a0a] text-white"     :
  u === "medium" ? "bg-[#f3f4f6] text-[#374151]" :
                   "bg-[#f3f4f6] text-[#9ca3af]";

const statusPill = (s: string) =>
  s === "published"
    ? "bg-[#0a0a0a] text-white"
    : "bg-[#f3f4f6] text-[#374151]";

const CARDS_PER_LOAD = 6;

export default function SMEExplorePage() {
  const [search, setSearch]             = useState("");
  const [activeStatus, setActiveStatus] = useState<"all" | "pending" | "published">("all");
  const [visibleCount, setVisibleCount] = useState(CARDS_PER_LOAD);
  const [articles, setArticles] = useState<ReviewArticle[]>(FALLBACK_ARTICLES);
  const [domainLabel, setDomainLabel] = useState("Technology");

  useEffect(() => {
    let alive = true;

    getCurrentProfile()
      .then(({ profile }) => {
        if (!alive) return;
        const domains = profile?.expertise_domains?.length ? profile.expertise_domains : [profile?.domain ?? "Technology"];
        setDomainLabel(domains.filter(Boolean).join(", "));
      })
      .catch(() => {});

    listReviewQueueArticles()
      .then(rows => {
        if (!alive || rows.length === 0) return;
        setArticles(rows.map(row => ({
          id: row.id.slice(0, 8).toUpperCase(),
          slug: row.slug,
          title: row.title,
          domain: row.domain_name,
          writer: row.author_name,
          submitted: formatArticleDate(row.submitted_at ?? row.updated_at),
          status: row.status === "published" ? "published" : "pending",
          urgency: row.status === "submitted" ? "high" : row.status === "revision_requested" ? "medium" : "low",
        })));
      })
      .catch(() => {});

    return () => {
      alive = false;
    };
  }, []);

  const filtered = articles
    .filter(a => activeStatus === "all" || a.status === activeStatus)
    .filter(a => !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.writer.toLowerCase().includes(search.toLowerCase()));

  const visible  = filtered.slice(0, visibleCount);
  const hasMore  = visibleCount < filtered.length;

  // Stats computed from filtered results, not full array
  const statsPending   = filtered.filter(a => a.status === "pending").length;
  const statsPublished = filtered.filter(a => a.status === "published").length;
  const statsTotal     = filtered.length;

  const resetVisible = () => setVisibleCount(CARDS_PER_LOAD);

  return (
    <AppLayout bg="bg-white">
      <div className="min-h-screen px-6 md:px-10 py-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
          <div>
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1 mb-1" aria-label="Breadcrumb">
              <Link
                href={dashRootPath("Subject Expert")}
                className="text-xs text-[#6b7280] hover:text-[#0a0a0a] transition-colors"
              >
                Dashboard
              </Link>
              <ChevronRight size={12} className="text-[#9ca3af]" />
              <span className="text-xs text-[#0a0a0a] font-medium">Explore</span>
            </nav>
            <h1 className="text-2xl md:text-3xl font-bold text-[#0a0a0a]">Review Queue</h1>
            <p className="text-sm text-[#6b7280] mt-1">
              Showing articles in your domain:{" "}
              <span className="font-semibold text-[#0a0a0a]">{domainLabel}</span>
            </p>
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

        {/* Stats bar — clean row with vertical dividers, computed from filtered */}
        <div className="flex border border-[#e5e7eb] rounded-[10px] bg-white mb-7">
          <div className="flex flex-col px-6 py-4 flex-1">
            <span className="text-[20px] font-semibold text-[#0a0a0a]">{statsPending}</span>
            <span className="text-[13px] text-[#6b7280]">Pending Review</span>
          </div>
          <div className="flex flex-col px-6 py-4 flex-1 border-l border-[#e5e7eb]">
            <span className="text-[20px] font-semibold text-[#0a0a0a]">{statsPublished}</span>
            <span className="text-[13px] text-[#6b7280]">Published</span>
          </div>
          <div className="flex flex-col px-6 py-4 flex-1 border-l border-[#e5e7eb]">
            <span className="text-[20px] font-semibold text-[#0a0a0a]">{statsTotal}</span>
            <span className="text-[13px] text-[#6b7280]">This Month</span>
          </div>
        </div>

        {/* Status filter — underline tab strip with full-width baseline */}
        <div className="flex border-b border-[#e5e7eb] mb-7">
          {(["all", "pending", "published"] as const).map(s => (
            <button
              key={s}
              onClick={() => { setActiveStatus(s); resetVisible(); }}
              className={`text-[14px] px-4 py-2.5 transition-colors cursor-pointer ${
                activeStatus === s
                  ? "text-[#0a0a0a] font-medium border-b-2 border-[#0a0a0a] -mb-px"
                  : "text-[#6b7280] hover:text-[#0a0a0a]"
              }`}
            >
              {s === "all" ? "All" : s === "pending" ? "Pending Review" : "Published"}
            </button>
          ))}
        </div>

        {/* Article cards grid — no ghost placeholders */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#6b7280] text-base">No articles found</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {visible.map(a => (
                <div
                  key={a.id}
                  className="bg-white border border-[#e5e7eb] rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.06)]
                             hover:shadow-[0_4px_12px_rgba(0,0,0,0.10)] hover:-translate-y-0.5
                             transition-all duration-200 p-5 flex flex-col min-h-[180px]"
                >
                  {/* Top row: ID + urgency */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] text-[#9ca3af] font-mono">{a.id}</span>
                    <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${urgencyPill(a.urgency)}`}>
                      {a.urgency}
                    </span>
                  </div>

                  {/* Title */}
                  <p className="text-sm font-semibold text-[#0a0a0a] line-clamp-2 flex-1 mb-3">{a.title}</p>

                  {/* Bottom row */}
                  <div className="flex items-center justify-between gap-2 pt-3 border-t border-[#f3f4f6] mt-auto">
                    <p className="text-xs text-[#6b7280] truncate">{a.writer} · {a.submitted}</p>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-[10px] font-medium px-2.5 py-0.5 rounded-full ${statusPill(a.status)}`}>
                        {a.status === "published" ? "Published" : "Pending"}
                      </span>
                      {a.status === "pending" ? (
                        <Link
                          href={`/articles/${a.slug}`}
                          className="text-[10px] font-semibold bg-[#0a0a0a] text-white px-2.5 py-1 rounded-full hover:bg-[#374151] transition-colors"
                        >
                          Review
                        </Link>
                      ) : (
                        <Link
                          href={`/articles/${a.slug}`}
                          className="text-[10px] text-[#6b7280] hover:text-[#0a0a0a] transition-colors"
                        >
                          View →
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More */}
            {hasMore && (
              <button
                onClick={() => setVisibleCount(c => c + CARDS_PER_LOAD)}
                className="w-full border border-[#e5e7eb] rounded-[8px] bg-white text-[#0a0a0a] text-sm font-medium py-3 hover:bg-[#f9fafb] transition-colors cursor-pointer"
              >
                Load more articles
              </button>
            )}
          </>
        )}

      </div>
    </AppLayout>
  );
}
