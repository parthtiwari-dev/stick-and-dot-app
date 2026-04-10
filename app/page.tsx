"use client";

import AppLayout from "@/components/AppLayout";
import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";

const CARD_GRADIENTS = [
  "linear-gradient(135deg, #c9b8c4 0%, #a8a0be 40%, #bfb0cc 70%, #a89bb5 100%)",
  "linear-gradient(135deg, #b8a9c9 0%, #9b8ea8 40%, #c4afc0 70%, #a89bb5 100%)",
  "linear-gradient(135deg, #b0a8c4 0%, #c4b4c9 40%, #a8a0b8 70%, #bfb0bf 100%)",
];

const CARDS = [
  { id: 1, title: "Title Name", author: "NAME AUTHOR/BUSINESS", gradient: CARD_GRADIENTS[0], slug: "article-1" },
  { id: 2, title: "Title Name", author: "NAME AUTHOR/BUSINESS", gradient: CARD_GRADIENTS[1], readTime: "X mins read", slug: "article-2", excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam," },
  { id: 3, title: "Title Name", author: "NAME AUTHOR/BUSINESS", gradient: CARD_GRADIENTS[2], slug: "article-3" },
];

function PortfolioContent() {
  return (
    <div className="min-h-screen bg-[#1a1a1f] text-white flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-100 mb-16 tracking-wide">My portfolio</h1>

        {/* Card row */}
        <div className="grid grid-cols-3 gap-4 w-full max-w-4xl items-end mb-8">
          {CARDS.map((card, i) => {
            const isFeatured = i === 1;
            return (
              <article
                key={card.id}
                className={`relative rounded-2xl overflow-hidden flex flex-col transition-transform duration-300 hover:-translate-y-1 ${isFeatured ? "scale-105 shadow-2xl z-10" : "shadow-lg"}`}
                style={{ background: card.gradient, minHeight: isFeatured ? 340 : 290 }}
              >
                {card.readTime && (
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-white/80 backdrop-blur-sm text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full">
                    <Clock size={11} strokeWidth={2} />
                    <span>{card.readTime}</span>
                  </div>
                )}
                <div className="flex-1" />
                <div className="px-5 pb-5">
                  <h3 className={`font-bold text-gray-800/90 mb-4 leading-tight ${isFeatured ? "text-4xl" : "text-3xl"}`}>
                    {card.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-white/80 shrink-0" />
                    <span className="text-[11px] font-semibold tracking-widest text-gray-700/80 uppercase">{card.author}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Footer - under middle card */}
        <div className="flex flex-col items-center gap-4 max-w-sm text-center">
          <p className="text-sm text-gray-400 leading-relaxed">{CARDS[1].excerpt}</p>
          <Link href={`/articles/${CARDS[1].slug}`}
            className="flex items-center gap-2 text-sm text-gray-200 border border-gray-600 hover:border-gray-400 hover:text-white transition-colors px-6 py-2 rounded-lg group"
          >
            Read Now
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PortfolioPage() {
  return (
    <AppLayout sidebarCollapsed={true}>
      <PortfolioContent />
    </AppLayout>
  );
}
