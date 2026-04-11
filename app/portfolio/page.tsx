"use client";
import AppLayout from "@/components/AppLayout";
import Link from "next/link";
import { Clock } from "lucide-react";

function ArticleCard({ id, featured }: { id: string; featured?: boolean }) {
  return (
    <Link href={`/articles/${id}`}>
      <div className={`relative cursor-pointer transition-all ${featured ? "scale-105 z-10 shadow-2xl" : "opacity-90 hover:opacity-100"}`}>
        <div className="relative rounded-2xl overflow-hidden" style={{height:320}}>
          <div className="absolute inset-0 bg-gradient-to-br from-[#c8b8d0] via-[#a89ab5] to-[#7a6b8a]"/>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"/>
          {featured && (
            <div className="absolute top-3 right-3 bg-[#111] text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
              <Clock size={11}/>X mins read
            </div>
          )}
          <div className="absolute bottom-12 left-0 right-0 px-5">
            <h3 className="text-gray-900 text-2xl font-bold">Title Name</h3>
          </div>
          <div className="absolute bottom-4 left-5 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-white/80"/>
            <span className="text-gray-800 text-xs font-medium">NAME AUTHOR/BUSINESS</span>
          </div>
        </div>
        {featured && (
          <div className="mt-3 text-center px-2">
            <p className="text-gray-300 text-sm leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
            </p>
            <button className="mt-3 bg-[#1A1A1A] border border-gray-600 text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-[#2a2a2a] transition-colors cursor-pointer">
              Read Now →
            </button>
          </div>
        )}
      </div>
    </Link>
  );
}

export default function PortfolioPage() {
  return (
    <AppLayout bg="bg-[#111111]">
      <div className="p-8 min-h-screen">
        <h1 className="text-3xl font-bold text-white text-center mb-10">My portfolio</h1>
        <div className="grid grid-cols-3 gap-6 items-start">
          <ArticleCard id="1"/>
          <ArticleCard id="2" featured/>
          <ArticleCard id="3"/>
        </div>
      </div>
    </AppLayout>
  );
}
