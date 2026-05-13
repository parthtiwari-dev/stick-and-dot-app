"use client";
import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import LightCard from "@/components/ui/LightCard";
import { Search } from "lucide-react";

const TAGS = ["All", "#Technology", "#Finance", "#Medical", "#Science", "#Design", "#Career", "#AI"];

const ARTICLES = [
  { id:"1", title:"The Silent Revolution in Neural Computing",       author:"Aisha R.",  tags:["#technology","#AI"],       readTime:"8 min"  },
  { id:"2", title:"How Minimalism Took Over the Design World",       author:"Ravi M.",   tags:["#design","#culture"],      readTime:"6 min"  },
  { id:"3", title:"The Hidden Economics of Attention",               author:"Priya K.",  tags:["#finance","#psychology"],  readTime:"10 min" },
  { id:"4", title:"Why Great Ideas Die in Meetings",                 author:"Sara T.",   tags:["#career","#productivity"], readTime:"5 min"  },
  { id:"5", title:"Building Systems That Last",                      author:"Aman G.",   tags:["#technology","#career"],   readTime:"7 min"  },
  { id:"6", title:"The Attention Economy and What It Costs Us",      author:"Neha S.",   tags:["#AI","#society"],          readTime:"9 min"  },
  { id:"7", title:"Decoding the Human Genome: 2025 Edition",         author:"Dev P.",    tags:["#medical","#science"],     readTime:"12 min" },
  { id:"8", title:"Climate Finance: Who's Really Paying",            author:"Meera S.",  tags:["#finance","#science"],     readTime:"8 min"  },
  { id:"9", title:"The Quiet Death of the Open Office",              author:"Arjun D.",  tags:["#career","#design"],       readTime:"6 min"  },
];

const CARDS_PER_PAGE = 6;

export default function ExplorePage() {
  const [search, setSearch]       = useState("");
  const [activeTag, setActiveTag] = useState("All");
  const [page, setPage]           = useState(0);

  const filtered = ARTICLES
    .filter(a => activeTag === "All" || a.tags.some(t => t.toLowerCase() === activeTag.toLowerCase()))
    .filter(a => !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.author.toLowerCase().includes(search.toLowerCase()));

  const totalPages = Math.ceil(filtered.length / CARDS_PER_PAGE);
  const visible = filtered.slice(page * CARDS_PER_PAGE, page * CARDS_PER_PAGE + CARDS_PER_PAGE);

  return (
    <AppLayout bg="bg-white">
      <div className="min-h-screen">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-10">

          {/* Hero search */}
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

          {/* Tag pills — horizontal scroll, no scrollbar */}
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

          {/* Cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {visible.map(a => (
              <LightCard
                key={a.id}
                size="lg"
                title={a.title}
                author={a.author}
                tags={a.tags}
                readTime={a.readTime}
                href={`/articles/${a.id}`}
              />
            ))}
            {visible.length === 0 && (
              <div className="col-span-3 text-center py-20">
                <p className="text-[#6b7280] text-base">No articles found</p>
              </div>
            )}
          </div>

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
      </div>
    </AppLayout>
  );
}