"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, FileText, Settings, FolderOpen, ChevronLeft, ChevronRight, Play, ArrowRight, Star, Upload, Settings2, X } from "lucide-react";
import { useParams } from "next/navigation";

const KEYWORDS = ["#technology", "#tech", "#Career"];
const KEYWORD_PILLS = ["Readability", "Grammar", "AI", "Plagiarism", "WPS", "SPP", "RW"];

function Sparkline() {
  return (
    <svg width="80" height="30" viewBox="0 0 80 30" fill="none">
      <polyline points="0,25 15,18 25,22 35,12 45,16 55,8 65,12 80,6" stroke="#4ade80" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

function ArticleContent() {
  const params = useParams();
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);

  const comments = Array(8).fill({ name: "Shaivya S.", date: "10/2/2023", quality: 4, text: "Lorem ipsum dolor Lorem ipsum dolor" });

  return (
    <div className="flex min-h-screen bg-white">
      {/* Narrow icon sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-14 bg-black flex flex-col items-center pt-6 pb-6 gap-2 z-20">
        <Link href="/dashboard" className="p-2.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors mb-2">
          <Home size={18} strokeWidth={1.5} />
        </Link>
        <Link href="/dashboard" className="p-2.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors">
          <Home size={18} strokeWidth={1.5} />
        </Link>
        <Link href="/articles/article-1" className="p-2.5 rounded-lg bg-white/10 text-white">
          <FileText size={18} strokeWidth={1.5} />
        </Link>
        <Link href="/settings" className="p-2.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors">
          <Settings size={18} strokeWidth={1.5} />
        </Link>
        <Link href="/portfolio" className="p-2.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors">
          <FolderOpen size={18} strokeWidth={1.5} />
        </Link>
        <div className="flex-1" />
        <button className="p-2.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors">
          <ChevronRight size={18} strokeWidth={1.5} />
        </button>
        <button className="p-2.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors">
          <ChevronLeft size={18} strokeWidth={1.5} />
        </button>
        <button className="p-2.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors">
          <Play size={16} strokeWidth={1.5} />
        </button>
      </aside>

      {/* Main article area */}
      <main className="flex-1 ml-14 max-w-2xl mx-auto px-6 py-8">
        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-2 leading-tight">
          The World's Most Dangerous Technology Ever Made.
        </h1>
        <p className="text-center text-sm text-gray-400 mb-1">Ralph Hawkins • May 7, 2019 (10 mins read)</p>
        <p className="text-center text-xs text-gray-400 mb-5">{KEYWORDS.join(" ")}</p>

        {/* Keywords + Engagement widget */}
        <div className="bg-black rounded-xl p-4 mb-6 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <p className="text-white text-sm font-semibold mb-1">Suggested Keywords</p>
              <p className="text-gray-400 text-xs mb-3">#technology #tech #Career</p>
              <div className="flex flex-wrap gap-2">
                {KEYWORD_PILLS.map(kw => (
                  <span key={kw} className="bg-white/10 text-gray-300 text-xs px-3 py-1 rounded-full border border-white/10 hover:bg-white/20 cursor-pointer transition-colors">{kw}</span>
                ))}
              </div>
            </div>
            <div className="text-right ml-4">
              <div className="flex items-center justify-end gap-2 mb-1">
                <p className="text-gray-400 text-xs">Engagement</p>
                <button className="text-gray-500 hover:text-white transition-colors">
                  <Settings2 size={14} />
                </button>
              </div>
              <p className="text-white text-2xl font-bold">2,4K</p>
              <Sparkline />
              <p className="text-gray-400 text-[10px]">263 contributions in</p>
              <p className="text-gray-400 text-[10px]">the last year</p>
            </div>
          </div>
        </div>

        {/* Hero image */}
        <div className="rounded-xl overflow-hidden mb-6 h-48 bg-gradient-to-br from-gray-700 to-gray-900 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-full bg-gradient-to-br from-gray-600 via-gray-800 to-gray-900 opacity-80" />
          </div>
          <div className="absolute bottom-3 right-3 text-gray-400 text-xs">🎸</div>
        </div>

        {/* Body text */}
        <div className="prose prose-sm text-gray-700 leading-relaxed space-y-4 mb-8">
          <p>Commodo labore ut nisi laborum amet eu qui magna ullamco ut labore. Aliquip consectetur labore consectetur dolor exercitation est minim quis. Magna non irure qui ex est laborum nulla excepteur qui. Anim Lorem dolore cupidatat pariatur ex tempor. Duis ea excepteur proident ex commodo irure est.</p>
          <p>Nisi commodo qui pariatur enim sint laborum consequat enim in officia. Officia fugiat incididunt commodo et mollit aliqua non aute. Enim dolor eiusmod aliqua amet ipsum in enim eiusmod. Quis exercitation sit velit duis.</p>
          <p>Est Lorem labore consectetur minim sit eu eiusmod mollit velt. Consectetur voluptate ex amet id eiusmod laborum irure. Aliquip ad qui id exercitation irure amet commodo nisi quis. Occaecat minim incididunt euismod nostrud veniam quis culpa.</p>
          <p>Aliquip mollit sunt qui irure. Irure ullamco Lorem excepteur dolor qui ea ad quis. Enim fugiat cillum enim ad occaecat sint qui elit labore mollit sunt laborum fugat consequat. Voluptate labore sunt duis eu deserunt. Occaecat do ut ut labore cillum enim dolore ad enim enim id. Aliquip do veniam ad excepteur ad cillum qui deserunt nostrud sunt aliqua duis sunt occaecat. Laborum incididunt commodo ullamco proident quis.</p>
        </div>

        {/* About the Author */}
        <div className="mb-8">
          <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-3">About The Author</p>
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden shrink-0">
              <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-500" />
            </div>
            <div>
              <p className="font-bold text-gray-900">Arthur Black</p>
              <p className="text-sm text-gray-400 mb-2">@arthurblack</p>
              <p className="text-sm text-gray-600 leading-relaxed">Ipsum adipisicing culpa est nisi consequat ex amet magna culpa veniam tempor irure ea. Reprehenderit labore do tempor eiusmod in consectetur ex sunt id mollit commodo ipsum deserunt quis.</p>
            </div>
          </div>
        </div>

        {/* Comments */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Comments</h2>

          {/* Add comment */}
          <div className="mb-4">
            <h3 className="text-base font-semibold text-gray-800 mb-2">Add a Comment</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Type your Comment"
                className="flex-1 border-b border-gray-300 text-sm text-gray-700 outline-none py-2 placeholder-gray-400 focus:border-gray-600 transition-colors bg-transparent"
              />
              <button className="flex items-center gap-1.5 text-xs text-gray-600 border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                <Upload size={13} />Upload
              </button>
            </div>
          </div>

          {/* Featured comment bubble */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-5 flex items-start gap-3">
            <div className="flex gap-1 shrink-0">
              <div className="w-6 h-6 rounded-full bg-yellow-400" />
              <div className="w-6 h-6 rounded-full bg-gray-800 -ml-2" />
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-800 shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-sm text-gray-800 mb-1">Shaivya S.</p>
              <p className="text-xs text-gray-500 leading-relaxed">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs bg-black text-white px-2 py-0.5 rounded-full">+$XXX</span>
                <button className="text-gray-400 hover:text-gray-700">→</button>
              </div>
            </div>
          </div>

          {/* Comments table */}
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                {["Name","Date Created","Quality","Comments"].map(h => (
                  <th key={h} className="text-left py-2 text-xs font-semibold text-gray-500 px-2">{h}</th>
                ))}
                <th />
              </tr>
            </thead>
            <tbody>
              {comments.map((c, i) => (
                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gray-300 shrink-0" />
                      <span className="text-xs text-gray-700">{c.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-xs text-gray-500">{c.date}</td>
                  <td className="py-3 px-2">
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(s => <Star key={s} size={11} className={s <= c.quality ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} />)}
                    </div>
                  </td>
                  <td className="py-3 px-2 text-xs text-gray-500">{c.text}</td>
                  <td className="py-3 px-2">
                    {i === 0 && (
                      <button className="w-6 h-6 rounded-full border-2 border-gray-400 flex items-center justify-center text-gray-400 hover:border-gray-600 hover:text-gray-700 transition-colors">
                        <X size={12} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Submit */}
          <button
            onClick={() => setComment("")}
            className="mt-6 bg-black text-white text-sm font-semibold px-8 py-3 rounded-lg hover:bg-gray-800 active:scale-[0.99] transition-all duration-200"
          >
            Submit
          </button>
        </div>
      </main>
    </div>
  );
}

export default function ArticlePage() {
  return <ArticleContent />;
}
