"use client";
import { useState, useEffect } from "react";
import { getStoredRole } from "@/lib/roles";
import AppLayout from "@/components/AppLayout";
import Link from "next/link";
import { useRouter } from "next/navigation";

const CARDS = [
  { id:"1", title:"The Silent Revolution in Neural Computing", author:"Shaivya Saini", mins:"8",  tag:"Technology", rating:4.8, views:"12.4K" },
  { id:"2", title:"How Minimalism Took Over the Design World", author:"Shaivya Saini", mins:"5",  tag:"Design",     rating:4.5, views:"9.1K"  },
  { id:"3", title:"The Hidden Economics of Attention",         author:"Shaivya Saini", mins:"12", tag:"Finance",    rating:4.9, views:"18.7K" },
  { id:"4", title:"Why Slow Reading Is Making a Comeback",     author:"Shaivya Saini", mins:"6",  tag:"Culture",    rating:4.3, views:"7.2K"  },
  { id:"5", title:"Building Products People Actually Love",    author:"Shaivya Saini", mins:"9",  tag:"Business",   rating:4.7, views:"14.0K" },
];

const WRITER_NAME = "Shaivya Saini";
const WRITER_BIO  = "Writing about technology, finance, and the future of work.";
const MEMBER_SINCE = "2023";

const uniqueDomains = [...new Set(CARDS.map(c => c.tag))].length;

export default function PortfolioPage() {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    try {
      const r = getStoredRole();
      if (r === "Writer" || r === "Subject Expert") { setAllowed(true); }
      else { router.replace("/dashboard/reader"); }
    } catch (_) { router.replace("/login"); }
  }, [router]);

  if (!allowed) return null;

  return (
    <AppLayout bg="bg-white">
      <div className="min-h-screen">
        <div className="max-w-5xl mx-auto px-6 md:px-12 py-10">

          {/* Portfolio header */}
          <div className="mb-10">
            <p className="text-xs text-[#6b7280] uppercase tracking-widest font-semibold mb-2">Portfolio</p>
            <h1 className="text-3xl md:text-4xl font-bold text-[#0a0a0a] mb-1">{WRITER_NAME}</h1>
            <p className="text-[#6b7280] text-sm mb-6">{WRITER_BIO}</p>

            {/* Stat row — monochrome with vertical dividers */}
            <div className="flex items-stretch border border-[#e5e7eb] rounded-xl overflow-hidden w-fit">
              <div className="flex flex-col items-center px-6 py-3 bg-white">
                <span className="text-lg font-bold text-[#0a0a0a]">{CARDS.length}</span>
                <span className="text-xs text-[#6b7280]">Articles</span>
              </div>
              <div className="flex flex-col items-center px-6 py-3 bg-white border-l border-[#e5e7eb]">
                <span className="text-lg font-bold text-[#0a0a0a]">{uniqueDomains}</span>
                <span className="text-xs text-[#6b7280]">Domains</span>
              </div>
              <div className="flex flex-col items-center px-6 py-3 bg-white border-l border-[#e5e7eb]">
                <span className="text-lg font-bold text-[#0a0a0a]">{MEMBER_SINCE}</span>
                <span className="text-xs text-[#6b7280]">Member Since</span>
              </div>
            </div>
          </div>

          {/* Articles grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CARDS.map(card => (
              <Link
                key={card.id}
                href={`/articles/${card.id}`}
                className="group block bg-white border border-[#e5e7eb] rounded-[12px] overflow-hidden
                           shadow-[0_1px_3px_rgba(0,0,0,0.06)]
                           hover:shadow-[0_4px_12px_rgba(0,0,0,0.10)] hover:-translate-y-0.5
                           transition-all duration-200 flex flex-col min-h-[210px]"
              >
                {/* Tag banner */}
                <div className="bg-[#fafafa] border-b border-[#e5e7eb] h-[72px] flex items-end px-4 pb-3 flex-shrink-0">
                  <span className="bg-[#0a0a0a] text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
                    {card.tag}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col gap-2 flex-1">
                  <p className="text-sm font-bold text-[#0a0a0a] line-clamp-2 group-hover:text-[#374151] transition-colors flex-1">
                    {card.title}
                  </p>
                  <p className="text-xs text-[#6b7280]">{card.author}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-[#f3f4f6] mt-auto">
                    <span className="text-xs text-[#9ca3af]">{card.mins} min read</span>
                    <span className="text-xs text-[#9ca3af]">★ {card.rating} · {card.views}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </div>
    </AppLayout>
  );
}