"use client";
import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import Link from "next/link";
import { Search, Clock, ChevronLeft, ChevronRight } from "lucide-react";

const TAGS = ["#hashtags","#hashtags","#hashtags","#hashtags"];

const CARDS = [
  { id: "1", title: "Title Name", author: "NAME AUTHOR/BUSINESS", mins: "X" },
  { id: "2", title: "Title Name", author: "NAME AUTHOR/BUSINESS", mins: "X" },
  { id: "3", title: "Title Name", author: "NAME AUTHOR/BUSINESS", mins: "X" },
];

const GRADIENTS = [
  "from-[#c8b8d0] via-[#a89ab5] to-[#8a7a9a]",
  "from-[#b8c8d0] via-[#9aaab5] to-[#7a8a9a]",
  "from-[#d0c8b8] via-[#b5aaa0] to-[#9a8a7a]",
];

function ArticleCard({ card, featured }: { card: typeof CARDS[0]; featured?: boolean }) {
  return (
    <Link href={`/articles/${card.id}`}>
      <div className={`relative cursor-pointer transition-all duration-300 ${featured ? "scale-105 z-10 shadow-2xl" : "opacity-80 hover:opacity-100 hover:scale-102"}`}>
        <div className={`relative rounded-2xl overflow-hidden bg-gradient-to-br ${GRADIENTS[parseInt(card.id)-1]}`}
          style={{ height: featured ? 340 : 300 }}>
          {featured && (
            <div className="absolute top-3 right-3 bg-black/70 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 backdrop-blur-sm">
              <Clock size={11}/>{card.mins} mins read
            </div>
          )}
          <div className="absolute bottom-12 left-0 right-0 px-5">
            <h3 className="text-gray-900 text-2xl font-bold drop-shadow-sm">{card.title}</h3>
          </div>
          <div className="absolute bottom-4 left-5 flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-white/80 flex-shrink-0"/>
            <span className="text-gray-800 text-xs font-medium">{card.author}</span>
          </div>
        </div>
        {featured && (
          <div className="mt-4 text-center px-2">
            <p className="text-gray-600 text-sm leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
            </p>
            <button className="mt-4 bg-black text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-gray-800 transition-colors cursor-pointer">
              Read Now →
            </button>
          </div>
        )}
      </div>
    </Link>
  );
}

export default function ExplorePage() {
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(true);

  return (
    <AppLayout bg="bg-white">
      <div className="p-4 md:p-8 min-h-screen">
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-6">Explore</h1>

        {/* Search */}
        <div className="flex justify-center mb-5">
          <div className="relative w-full max-w-2xl">
            <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"/>
            <input type="text" value={query} onChange={e=>setQuery(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&setSearched(true)}
              placeholder="Explore with Keywords/Topics/Authors"
              className="w-full pl-12 pr-5 py-4 rounded-full border border-gray-200 text-gray-800 placeholder:text-gray-400 outline-none focus:border-gray-400 text-sm bg-gray-50 transition-colors"/>
          </div>
        </div>

        {searched && (
          <>
            <p className="text-gray-500 text-sm text-center mb-4">
              Showing search results for <span className="text-gray-900 font-bold italic">&apos;KEYWORD&apos;</span>
            </p>
            <div className="flex flex-wrap gap-3 justify-center mb-8">
              {TAGS.map((t,i) => (
                <button key={i} className="border border-gray-300 text-gray-600 text-sm px-5 py-2 rounded-full hover:bg-gray-50 cursor-pointer transition-colors">{t}</button>
              ))}
            </div>
          </>
        )}

        {/* Carousel */}
        <div className="relative flex items-center gap-2">
          <button className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center cursor-pointer transition-colors z-10">
            <ChevronLeft size={18} className="text-gray-700"/>
          </button>
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-6 items-start overflow-hidden">
            {CARDS.map((card, i) => (
              <ArticleCard key={card.id} card={card} featured={i===1} />
            ))}
          </div>
          <button className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center cursor-pointer transition-colors z-10">
            <ChevronRight size={18} className="text-gray-700"/>
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
