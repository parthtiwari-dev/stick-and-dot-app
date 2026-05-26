"use client";
import { useEffect, useState } from "react";
import AppLayout from "@/components/AppLayout";
import Link from "next/link";
import { Search, Trash2, ArrowRight } from "lucide-react";
import { listSavedArticles, removeReadingListItem, type SavedArticleRow } from "@/lib/supabase/reading";

export default function ReadingListPage() {
  const [articles, setArticles] = useState<SavedArticleRow[]>([]);
  const [search, setSearch]     = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    listSavedArticles()
      .then(rows => {
        if (alive) setArticles(rows);
      })
      .catch(err => {
        if (alive) setError(err instanceof Error ? err.message : "Unable to load reading list.");
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const remove = (itemId: string) => {
    setArticles(p => p.filter(a => a.itemId !== itemId));
    void removeReadingListItem(itemId).catch(() => {});
  };

  const filtered = articles.filter(a =>
    !search.trim() ||
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.author.toLowerCase().includes(search.toLowerCase()) ||
    a.tag.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout bg="bg-[#F4F4F4]">
      <div className="p-4 md:p-6 min-h-screen">

        {/* Header — single clean header, no search here */}
        <div className="mb-6">
          <p className="text-xs text-gray-400 mb-0.5">Dashboard&gt;Reading List</p>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Reading List</h1>
          <p className="text-sm text-gray-500 mt-0.5">Your saved articles and reading progress</p>
        </div>

        {/* Single search bar */}
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 mb-4 max-w-md">
          <Search size={14} className="text-gray-400 flex-shrink-0"/>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Filter by title, author, topic…"
            className="flex-1 text-sm text-gray-700 outline-none placeholder:text-gray-300 bg-transparent"
          />
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-5 mb-5 text-xs text-gray-500">
          <span>{articles.length} saved</span>
          <span className="w-px h-3 bg-gray-300"/>
          <span>{articles.filter(a => a.progress === 100).length} finished</span>
          <span className="w-px h-3 bg-gray-300"/>
          <span>{articles.filter(a => a.progress > 0 && a.progress < 100).length} in progress</span>
        </div>

        {/* Article list */}
        <div className="flex flex-col gap-3">
          {filtered.map(a => (
            <div key={a.itemId} className="bg-white rounded-2xl p-5 border border-gray-100 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full">{a.tag}</span>
                  <span className="text-xs text-gray-400">Saved {a.savedDate}</span>
                </div>
                <p className="text-base font-semibold text-gray-900 mb-0.5 leading-snug truncate">{a.title}</p>
                <p className="text-xs text-gray-500 mb-3">{a.author} · {a.totalMins} min read</p>

                {/* Progress bar */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-100 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${a.progress}%`,
                        background: a.progress === 100 ? "#22c55e" : "#111"
                      }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 flex-shrink-0 w-8 text-right tabular-nums">
                    {a.progress}%
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Link href={`/articles/${a.slug}`}>
                  <button className="flex items-center gap-1.5 text-sm font-semibold bg-[#111] text-white px-4 py-2.5 rounded-xl hover:bg-[#333] transition-colors cursor-pointer whitespace-nowrap">
                    {a.progress === 0 ? "Start" : a.progress === 100 ? "Re-read" : "Continue"}
                    <ArrowRight size={14}/>
                  </button>
                </Link>
                <button onClick={() => remove(a.itemId)}
                  className="p-2.5 text-gray-400 hover:text-red-400 hover:bg-red-50 rounded-xl transition-colors cursor-pointer">
                  <Trash2 size={16}/>
                </button>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="bg-white rounded-2xl p-10 border border-gray-100 text-center">
              <p className={`${error ? "text-red-500" : "text-gray-400"} text-sm mb-3`}>
                {loading ? "Loading saved articles..." : error || (search ? "No saved articles match your search." : "Your reading list is empty.")}
              </p>
              {!loading && !error && !search && (
                <Link href="/explore">
                  <button className="text-sm font-semibold text-white bg-[#111] px-5 py-2.5 rounded-xl hover:bg-[#333] transition-colors cursor-pointer">
                    Browse Articles
                  </button>
                </Link>
              )}
            </div>
          )}
        </div>

      </div>
    </AppLayout>
  );
}
