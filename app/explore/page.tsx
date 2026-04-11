"use client";
import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import Link from "next/link";
import { Search } from "lucide-react";

const TAGS = ["#hashtag", "#hashtag", "#hashtag", "#hashtag"];
const ARTICLES = [
  { id: "1", title: "Title Name", author: "NAME AUTHOR/BUSINESS", excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
  { id: "2", title: "Title Name", author: "NAME AUTHOR/BUSINESS", excerpt: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip." },
  { id: "3", title: "Title Name", author: "NAME AUTHOR/BUSINESS", excerpt: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat." },
];

function ArticleCard({ article, featured }: { article: typeof ARTICLES[0]; featured?: boolean }) {
  return (
    <Link href={`/articles/${article.id}`}>
      <div className={`bg-white rounded-2xl overflow-hidden cursor-pointer hover:shadow-md transition-shadow border border-gray-100 ${featured?"ring-2 ring-[#F97316]":""}`}>
        <div className="h-40 bg-gradient-to-br from-[#9b8ea8] to-[#c4b5c9] relative">
          {featured && <div className="absolute top-2 right-2 bg-[#F97316] text-white text-xs px-2 py-0.5 rounded-full">1 min read</div>}
        </div>
        <div className="p-4">
          <p className="font-semibold text-gray-900 text-sm mb-1">{article.title}</p>
          <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
            <span className="w-4 h-4 rounded-full bg-gray-200 inline-block"/>
            {article.author}
          </p>
          {featured && <p className="text-xs text-gray-500 leading-relaxed mb-3">{article.excerpt}</p>}
          {featured && <button className="text-xs text-gray-700 font-semibold hover:text-black transition-colors cursor-pointer">Read Now →</button>}
        </div>
      </div>
    </Link>
  );
}

export default function ExplorePage() {
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) setSearched(true);
  };

  return (
    <AppLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">Explore</h1>

        <form onSubmit={handleSearch} className="flex justify-center mb-6">
          <div className="relative w-full max-w-xl">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"/>
            <input
              type="text" value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Explore with Keywords, Topics, Authors…"
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 bg-white outline-none focus:border-gray-400 text-sm text-gray-800 shadow-sm"
            />
          </div>
        </form>

        {searched && (
          <>
            <p className="text-sm text-gray-500 text-center mb-4">Showing search results for <strong className="text-gray-800">"{query}"</strong></p>
            <div className="flex gap-2 justify-center mb-6 flex-wrap">
              {TAGS.map((t,i) => (
                <button key={i} className="bg-white border border-gray-200 text-gray-600 text-xs px-4 py-1.5 rounded-full hover:bg-gray-50 cursor-pointer">{t}</button>
              ))}
            </div>
          </>
        )}

        <div className="grid grid-cols-3 gap-4">
          {ARTICLES.map((a, i) => <ArticleCard key={a.id} article={a} featured={i===1}/>)}
        </div>
      </div>
    </AppLayout>
  );
}
