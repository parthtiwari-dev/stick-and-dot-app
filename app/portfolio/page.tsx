"use client";
import AppLayout from "@/components/AppLayout";
import Link from "next/link";

const PORTFOLIO_ITEMS = [
  { id: "1", title: "Title Name", author: "NAME AUTHOR/BUSINESS" },
  { id: "2", title: "Title Name", author: "NAME AUTHOR/BUSINESS" },
  { id: "3", title: "Title Name", author: "NAME AUTHOR/BUSINESS" },
];

export default function PortfolioPage() {
  return (
    <AppLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-8">My portfolio</h1>
        <div className="grid grid-cols-3 gap-5">
          {PORTFOLIO_ITEMS.map(item => (
            <Link key={item.id} href={`/articles/${item.id}`}>
              <div className="bg-white rounded-2xl overflow-hidden cursor-pointer hover:shadow-md transition-shadow border border-gray-100">
                <div className="h-48 bg-gradient-to-br from-[#9b8ea8] to-[#c4b5c9]"/>
                <div className="p-4">
                  <p className="font-semibold text-gray-900 text-sm mb-2">{item.title}</p>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-5 h-5 rounded-full bg-gray-200"/>
                    <p className="text-xs text-gray-400">{item.author}</p>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed mb-3">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.</p>
                  <button className="text-xs text-gray-700 font-semibold hover:text-black transition-colors cursor-pointer">Read Now →</button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
