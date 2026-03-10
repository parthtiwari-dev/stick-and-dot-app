"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; 
import { Search, Clock, ArrowRight } from "lucide-react";
import AppLayout from "@/components/AppLayout";

/* ── Gradient placeholder thumbnails ── */
const CARD_GRADIENTS = [
  "linear-gradient(135deg, #b8a9c9 0%, #9b8ea8 40%, #c4afc0 70%, #a89bb5 100%)",
  "linear-gradient(135deg, #c9b8c4 0%, #a8a0be 40%, #bfb0cc 70%, #a89bb5 100%)",
  "linear-gradient(135deg, #b0a8c4 0%, #c4b4c9 40%, #a8a0b8 70%, #bfb0bf 100%)",
];

/* ── Types ── */
interface CardData {
  id: number;
  title: string;
  author: string;
  gradient: string;
  readTime?: string; // only shown on featured (middle) card
  excerpt: string;
}

const CARDS: CardData[] = [
  {
    id: 1,
    title: "Title Name",
    author: "NAME AUTHOR/BUSINESS",
    gradient: CARD_GRADIENTS[0],
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 2,
    title: "Title Name",
    author: "NAME AUTHOR/BUSINESS",
    gradient: CARD_GRADIENTS[1],
    readTime: "X mins read",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,",
  },
  {
    id: 3,
    title: "Title Name",
    author: "NAME AUTHOR/BUSINESS",
    gradient: CARD_GRADIENTS[2],
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
];

const HASHTAGS = ["#hashtags", "#hashtags", "#hashtags", "#hashtags"];

/* ── Article Card ── */
interface ArticleCardProps {
  card: CardData;
  featured?: boolean;
}

function ArticleCard({ card, featured = false }: ArticleCardProps) {
  return (
    <article
      className={`
        relative rounded-2xl overflow-hidden flex flex-col
        transition-transform duration-300 hover:-translate-y-1
        ${featured ? "scale-105 shadow-2xl z-10" : "shadow-lg"}
      `}
      style={{
        background: card.gradient,
        minHeight: featured ? "320px" : "280px",
      }}
    >
      {/* Read time pill — only on featured card */}
      {card.readTime && (
        <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-white/80 backdrop-blur-sm text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full">
          <Clock size={11} strokeWidth={2} />
          <span>{card.readTime}</span>
        </div>
      )}

      {/* Spacer — pushes content to bottom */}
      <div className="flex-1" />

      {/* Bottom content overlay */}
      <div className="px-5 pb-5">
        <h3
          className={`font-bold text-gray-800/90 mb-4 leading-tight
            ${featured ? "text-4xl" : "text-3xl"}
          `}
        >
          {card.title}
        </h3>

        {/* Author row */}
        <div className="flex items-center gap-2">
          {/* Avatar circle */}
          <div className="w-7 h-7 rounded-full bg-white/80 shrink-0" />
          <span className="text-[11px] font-semibold tracking-widest text-gray-700/80 uppercase">
            {card.author}
          </span>
        </div>
      </div>
    </article>
  );
}

/* ── Explore inner content ── */
function ExploreContent() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#1a1a1f] text-white flex flex-col">
      {/* ── Header ── */}
      <header className="pt-14 pb-6 flex flex-col items-center gap-6 px-6">
        {/* Title */}
        <h1 className="text-5xl font-light tracking-wide text-gray-100">
          Explore
        </h1>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="w-full max-w-2xl relative">
          <Search
            size={17}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Explore with Keywords/Topics/Authors"
            className="
              w-full rounded-full bg-[#2a2a32] border border-white/10
              text-sm text-gray-200 placeholder-gray-500
              pl-12 pr-6 py-4
              outline-none focus:border-white/25
              transition-colors duration-200
            "
          />
        </form>

        {/* Search results label */}
        <p className="text-sm text-gray-400 italic">
          Showing search results for{" "}
          <span className="text-gray-200 font-semibold not-italic">
            &lsquo;KEYWORD&rsquo;
          </span>
        </p>

        {/* Hashtag pills */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {HASHTAGS.map((tag, i) => (
            <button
              key={i}
              onClick={() =>
                router.push(`/topics/${tag.replace("#", "")}-${i}`)
              }
              className="px-4 py-1.5 rounded-full border border-white/20 text-sm text-gray-300 hover:border-white/40 hover:text-white transition-colors duration-200 cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>
      </header>

      {/* ── Card Grid ── */}
      <section className="px-8 pb-6 flex-1">
        <div className="grid grid-cols-3 gap-4 items-end max-w-5xl mx-auto">
          {CARDS.map((card, i) => (
            <ArticleCard key={card.id} card={card} featured={i === 1} />
          ))}
        </div>
      </section>

      {/* ── Footer ── */}

      <footer className="flex flex-col items-center gap-4 pb-14 px-6 text-center max-w-lg mx-auto w-full">
        <p className="text-sm text-gray-400 leading-relaxed">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam,
        </p>

        {/* ✅ "Read Now" triggers 404 for unbuilt article routes */}
        <button
          onClick={() => router.push("/articles/sample-article")}
          className="flex items-center gap-2 text-sm text-gray-200 hover:text-white transition-colors group cursor-pointer"
        >
          Read Now
          <ArrowRight
            size={15}
            className="group-hover:translate-x-1 transition-transform duration-200"
          />
        </button>
      </footer>
    </div>
  );
}

/* ── Default Export ── */
export default function ExplorePage() {
  return (
    <AppLayout sidebarCollapsed={true}>
      <ExploreContent />
    </AppLayout>
  );
}
