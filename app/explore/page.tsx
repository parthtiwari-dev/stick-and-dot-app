"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import AppLayout from "@/components/AppLayout";

const CARD_GRADIENTS = [
  "#8c7a6b",
  "#5c5c5c",
  "#7a6a5a",
  "#4a4a4a",
  "#6a6060",
];

const ARTICLES = [
  { id: 1, title: "Title Name", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididu...", tags: ["Tag", "Tag"], author: "NAME AUTHOR/BUSINESS", color: CARD_GRADIENTS[0], slug: "article-1" },
  { id: 2, title: "Title Name", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididu...", tags: ["Tag", "Tag"], author: "NAME AUTHOR/BUSINESS", color: CARD_GRADIENTS[1], slug: "article-2" },
  { id: 3, title: "Title Name", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididu...", tags: ["Tag", "Tag"], author: "NAME AUTHOR/BUSINESS", color: CARD_GRADIENTS[2], slug: "article-3", featured: true },
  { id: 4, title: "Title Name", desc: "Lorem ipsum dolor sit amet consectetur adipiscing elit, sed do eiusmod tempor incididu...", tags: ["Tag"], author: "NAME AUTHOR/BUSINESS", color: CARD_GRADIENTS[3], slug: "article-4" },
  { id: 5, title: "Title Name", desc: "Lorem ipsum dolor sit amet consectetur adipiscing elit, sed do eiusmod tempor incididu...", tags: ["Tag"], author: "NAME AUTHOR/BUSINESS", color: CARD_GRADIENTS[4], slug: "article-5" },
];

function ExploreContent() {
  const [query, setQuery] = useState("");

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Dark header hero */}
      <div className="bg-black px-8 pt-10 pb-8 flex flex-col items-center gap-5">
        {/* Top search bar */}
        <div className="self-end flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm text-gray-400 w-56">
          <Search size={14} className="text-gray-500" /><span>Search</span>
        </div>
        <h1 className="text-4xl font-bold text-white tracking-wide">Explore</h1>
        <div className="w-full max-w-2xl relative">
          <Search size={17} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Explore with Keywords/Topics/Authors"
            className="w-full rounded-full bg-white/5 border border-white/15 text-sm text-gray-200 placeholder-gray-500 pl-12 pr-6 py-4 outline-none focus:border-white/30 transition-colors"
          />
        </div>
      </div>

      {/* Articles carousel */}
      <div className="px-6 py-8 overflow-x-auto">
        <div className="flex gap-4 min-w-max mx-auto">
          {ARTICLES.map((article, i) => {
            const isFeatured = article.featured;
            return (
              <Link key={article.id} href={`/articles/${article.slug}`}
                className={`flex flex-col bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer ${isFeatured ? "w-80 -mt-6 shadow-xl z-10" : "w-56"}`}
              >
                {/* Thumbnail */}
                <div className="rounded-xl m-3 mb-0" style={{ background: article.color, height: isFeatured ? 200 : 150 }} />
                {/* Content */}
                <div className="p-4 flex flex-col flex-1">
                  <h3 className={`font-bold text-gray-900 mb-2 ${isFeatured ? "text-lg" : "text-base"}`}>{article.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed mb-3 flex-1">{article.desc}</p>
                  <div className="flex gap-2 mb-3">
                    {article.tags.map((tag, ti) => (
                      <span key={ti} className="bg-black text-white text-[10px] font-medium px-3 py-1 rounded-full">{tag}</span>
                    ))}
                  </div>
                  {isFeatured && (
                    <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                      <div className="w-6 h-6 rounded-full bg-gray-200 shrink-0" />
                      <span className="text-[11px] text-gray-500 uppercase tracking-widest font-semibold">{article.author}</span>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <AppLayout sidebarCollapsed={false}>
      <ExploreContent />
    </AppLayout>
  );
}
