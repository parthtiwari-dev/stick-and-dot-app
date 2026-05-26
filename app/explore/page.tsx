"use client";
import { useEffect, useState } from "react";
import AppLayout from "@/components/AppLayout";
import LightCard from "@/components/ui/LightCard";
import { Search } from "lucide-react";
import { formatReadTime, listPublishedArticles } from "@/lib/supabase/articles";

const TAGS = ["All", "#Technology", "#Finance", "#Medical", "#Science", "#Design", "#Career", "#AI"];
const CARDS_PER_PAGE = 6;

type ExploreArticle = { id: string; slug: string; title: string; author: string; tags: string[]; readTime: string };

export default function ExplorePage() {
  const [search, setSearch]       = useState("");
  const [activeTag, setActiveTag] = useState("All");
  const [page, setPage]           = useState(0);
  const [articles, setArticles] = useState<ExploreArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    listPublishedArticles()
      .then(rows => {
        if (!alive) return;
        setArticles(rows.map(row => ({
          id: row.id,
          slug: row.slug,
          title: row.title,
          author: row.author_name,
          tags: row.tags.length ? row.tags : [`#${row.domain_name}`],
          readTime: formatReadTime(row.read_time_minutes),
        })));
      })
      .catch(err => {
        if (alive) setError(err instanceof Error ? err.message : "Unable to load articles.");
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const filtered = articles
    .filter(a => activeTag === "All" || a.tags.some(t => t.toLowerCase() === activeTag.toLowerCase()))
    .filter(a => !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.author.toLowerCase().includes(search.toLowerCase()));

  const totalPages = Math.ceil(filtered.length / CARDS_PER_PAGE);
  const visible = filtered.slice(page * CARDS_PER_PAGE, page * CARDS_PER_PAGE + CARDS_PER_PAGE);

  return (
    <AppLayout bg="bg-white">
      <div className="min-h-screen">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-10">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-[#0a0a0a] mb-2">Explore Articles</h1>
            <p className="text-[#6b7280] text-sm mb-6">Discover expert-reviewed content across every domain</p>
            <div className="flex items-center gap-2 bg-white border border-[#e5e7eb] rounded-lg px-4 py-3 max-w-lg mx-auto">
              <Search size={14} className="text-[#9ca3af] flex-shrink-0" />
              <input
                type="text"
                placeholder="Search topics, articles, authors..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(0); }}
                className="bg-transparent text-sm text-[#0a0a0a] outline-none flex-1 placeholder:text-[#9ca3af]"
              />
            </div>
          </div>

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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {visible.map(a => (
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
            {loading && (
              <div className="col-span-3 text-center py-20">
                <p className="text-[#6b7280] text-base">Loading articles...</p>
              </div>
            )}
            {!loading && error && (
              <div className="col-span-3 text-center py-20">
                <p className="text-red-500 text-base">{error}</p>
              </div>
            )}
            {!loading && !error && visible.length === 0 && (
              <div className="col-span-3 text-center py-20">
                <p className="text-[#6b7280] text-base">No articles found</p>
              </div>
            )}
          </div>

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
      </div>
    </AppLayout>
  );
}
