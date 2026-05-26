"use client";
import { useEffect, useState } from "react";
import AppLayout from "@/components/AppLayout";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { dashRootPath } from "@/lib/roles";
import { formatReadTime, listMyArticles, STATUS_LABELS } from "@/lib/supabase/articles";

const TAGS = ["All", "#Technology", "#Finance", "#Design", "#AI", "#Career"];

type PortfolioArticle = {
  id: string;
  slug: string;
  title: string;
  author: string;
  tags: string[];
  readTime: string;
  status: string;
};

const CARDS_PER_PAGE = 6;

const statusBadge = (s: string) => {
  if (s === "Published") return "bg-[#0a0a0a] text-white";
  if (s === "Pending")   return "bg-[#f3f4f6] text-[#374151]";
  return "bg-[#f3f4f6] text-[#9ca3af]"; // Draft
};

export default function WriterPortfolioPage() {
  const [activeTag, setActiveTag] = useState("All");
  const [page, setPage] = useState(0);
  const [articles, setArticles] = useState<PortfolioArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    listMyArticles()
      .then(rows => {
        if (!alive) return;
        setArticles(rows.map(row => ({
          id: row.id,
          slug: row.slug,
          title: row.title,
          author: "You",
          tags: row.tags.length ? row.tags : [`#${row.domain_name}`],
          readTime: formatReadTime(row.read_time_minutes),
          status: STATUS_LABELS[row.status],
        })));
      })
      .catch(err => {
        if (alive) setError(err instanceof Error ? err.message : "Unable to load your articles.");
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const filtered = activeTag === "All"
    ? articles
    : articles.filter(a => a.tags.some(t => t.toLowerCase() === activeTag.toLowerCase()));

  const totalPages = Math.ceil(filtered.length / CARDS_PER_PAGE);
  const visible = filtered.slice(page * CARDS_PER_PAGE, page * CARDS_PER_PAGE + CARDS_PER_PAGE);

  return (
    <AppLayout bg="bg-white">
      <div className="min-h-screen px-6 md:px-10 py-10">

        {/* Header */}
        <div className="mb-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1 mb-1" aria-label="Breadcrumb">
            <Link
              href={dashRootPath("Writer")}
              className="text-xs text-[#6b7280] hover:text-[#0a0a0a] transition-colors"
            >
              Dashboard
            </Link>
            <ChevronRight size={12} className="text-[#9ca3af]" />
            <span className="text-xs text-[#0a0a0a] font-medium">Portfolio</span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-bold text-[#0a0a0a]">My Portfolio</h1>
          <p className="text-sm text-[#6b7280] mt-1">Your articles and their current status</p>
        </div>

        {/* Tag filter pills — horizontal scroll */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 mb-8">
          {TAGS.map(tag => (
            <button
              key={tag}
              onClick={() => { setActiveTag(tag); setPage(0); }}
              aria-pressed={activeTag === tag}
              className={`flex-shrink-0 text-xs px-4 py-2 rounded-full font-medium transition-all duration-200 cursor-pointer ${
                activeTag === tag
                  ? "bg-[#0a0a0a] text-white"
                  : "bg-[#f3f4f6] text-[#374151] hover:bg-[#e5e7eb]"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Cards grid — no ghost placeholders */}
        {visible.length === 0 ? (
          <div className="text-center py-20">
            <p className={`${error ? "text-red-500" : "text-[#6b7280]"} text-base`}>
              {loading ? "Loading articles..." : error || "No articles found"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {visible.map(a => (
              <Link
                key={a.id}
                href={`/articles/${a.slug}?own=1`}
                className="group relative block bg-white border border-[#e5e7eb] rounded-[12px] overflow-hidden
                           shadow-[0_1px_3px_rgba(0,0,0,0.06)]
                           hover:shadow-[0_4px_12px_rgba(0,0,0,0.10)] hover:-translate-y-0.5
                           transition-all duration-200 flex flex-col min-h-[220px]"
              >
                {/* Status badge — top-right, monochrome pill */}
                <span
                  className={`absolute top-3 right-3 z-10 text-[10px] font-semibold px-2.5 py-1 rounded-full ${statusBadge(a.status)}`}
                >
                  {a.status}
                </span>

                {/* Tag banner */}
                <div className="bg-[#fafafa] border-b border-[#e5e7eb] h-[72px] flex items-end px-4 pb-3 flex-shrink-0">
                  <span className="bg-[#0a0a0a] text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
                    {a.tags[0] ?? "#article"}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col gap-2 flex-1">
                  <p className="text-sm font-bold text-[#0a0a0a] line-clamp-2 group-hover:text-[#374151] transition-colors flex-1">
                    {a.title}
                  </p>

                  {a.tags.slice(1).length > 0 && (
                    <div className="flex gap-1.5 flex-wrap">
                      {a.tags.slice(1).map(t => (
                        <span key={t} className="text-[10px] bg-[#f3f4f6] text-[#6b7280] px-2 py-0.5 rounded-full">{t}</span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-[#f3f4f6] mt-auto">
                    <span className="text-xs text-[#6b7280]">{a.author}</span>
                    <span className="text-xs text-[#9ca3af]">{a.readTime}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination — Previous / Page X of Y / Next */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              aria-label="Previous page"
              className="text-sm font-medium text-[#374151] hover:text-[#0a0a0a] disabled:text-[#9ca3af] disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              Previous
            </button>
            <span className="text-sm text-[#6b7280]">Page {page + 1} of {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              aria-label="Next page"
              className="text-sm font-medium text-[#374151] hover:text-[#0a0a0a] disabled:text-[#9ca3af] disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              Next
            </button>
          </div>
        )}

      </div>
    </AppLayout>
  );
}
