"use client";
import { useState } from "react";
import { Search, Upload, Star, ArrowLeft, ArrowRight, Play, Settings, Home } from "lucide-react";
import Link from "next/link";

function Stars({ n, size=12 }: { n: number; size?: number }) {
  return <span className="flex gap-0.5">{[1,2,3,4,5].map(i=><Star key={i} size={size} fill={i<=n?"#F97316":"none"} className={i<=n?"text-[#F97316]":"text-gray-300"}/>)}</span>;
}

const COMMENTS = Array(8).fill(null).map((_, i) => ({
  name: "Shaivya S.", date: "10/2/2023", quality: i%2===0?5:4,
  comment: "Lorem ipsum dolor Lorem ipsum dolor"
}));

export default function ArticlePage() {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  return (
    <div className="flex min-h-screen bg-white">
      {/* Slim dark sidebar - article-specific */}
      <aside className="fixed top-0 left-0 h-screen w-[60px] bg-[#0A0A0A] flex flex-col items-center z-20 rounded-r-2xl py-5 gap-3">
        <Link href="/dashboard/writer" className="text-gray-500 hover:text-white transition-colors p-2 rounded-xl">
          <Home size={18} strokeWidth={1.5}/>
        </Link>
        <div className="flex-1 flex flex-col gap-3 mt-2">
          {[Settings, ArrowLeft, ArrowRight, Play].map((Icon, i) => (
            <button key={i} className="text-gray-500 hover:text-white transition-colors p-2 rounded-xl cursor-pointer">
              <Icon size={16} strokeWidth={1.5}/>
            </button>
          ))}
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-[60px] flex-1 max-w-3xl mx-auto px-8 py-8">
        {/* Article title */}
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
          The World&apos;s Most Dangerous Technology Ever Made.
        </h1>
        <div className="text-center mb-1">
          <p className="text-xs text-gray-400">Ralph Hawkins · May 7, 2019 (10 mins read)</p>
          <p className="text-xs text-gray-400">#technology #tech #career</p>
        </div>

        {/* Keywords + Engagement card */}
        <div className="bg-[#1A1A1A] rounded-2xl p-5 mb-5 mt-5">
          <div className="flex gap-6">
            <div className="flex-1">
              <p className="text-white text-sm font-semibold mb-3">Suggested Keywords</p>
              <div className="flex flex-wrap gap-2">
                {["Readability","Grammar","AI","Plagiarism","WPS","SPP","RW-"].map(k=>(
                  <span key={k} className="bg-[#2a2a2a] text-gray-300 text-xs px-3 py-1.5 rounded-full">{k}</span>
                ))}
              </div>
            </div>
            <div className="text-right">
              <p className="text-white text-xs font-semibold mb-1">Engagement</p>
              <p className="text-white text-4xl font-bold">2.4K</p>
              <p className="text-gray-400 text-xs mt-1">263 contributions in the last year</p>
              <svg width="120" height="28" viewBox="0 0 120 28" className="mt-1 ml-auto">
                <polyline points="0,22 20,18 40,20 60,8 80,12 100,5 120,3" stroke="#4ade80" strokeWidth="1.5" fill="none"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Hero image */}
        <div className="w-full h-64 bg-gradient-to-br from-gray-700 to-gray-500 rounded-2xl mb-6"/>

        {/* Article body */}
        <div className="text-sm text-gray-700 leading-relaxed space-y-4">
          <p>Commodo labore ut nisi laborum amet eu qui magna ullamco ut labore. Aliquip consectetur labore consectetur dolor exercitation est minim quis. Magna non irure qui ex est laborum nulla excepteur qui. Anim Lorem dolore cupidatat pariatur ex tempor. Duis ea excepteur proident ex commodo irure est.</p>
          <p>Nisi commodo qui pariatur enim sint laborum consequat enim in officia. Officia fugiat incididunt commodo et mollit aliqua non aute. Enim dolor eiusmod aliqua amet ipsum in enim eiusmod. Quis exercitation sit velit duis.</p>
          <p>Est Lorem consectetur minim sit eu eiusmod mollit velit. Consectetur voluptate ex amet id eiusmod laborum irure. Aliquip ad qui id exercitation irure amet commodo nisi quis. Occaecat minim incididunt eiusmod nostrud veniam quis culpa. Nisi ipsum et consequat id deserunt excepteur. Cillum non pariatur culpa ut occaecat laboris eu.</p>
          <p>Aliquip mollit sunt qui irure. Irure ullamco Lorem excepteur dolor qui ea ad quis. Enim fugiat cillum enim ad occaecat sint qui elit labore mollit sunt laborum fugiat consequat. Voluptate labore sunt duis eu deserunt. Occaecat do ut ut labore cillum enim dolore ad enim enim id. Aliquip do veniam ad excepteur ad cillum qui deserunt nostrud sunt aliqua duis sunt occaecat.</p>
        </div>

        {/* About Author */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">About the Author</p>
          <div className="flex gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-500 to-gray-700 flex-shrink-0"/>
            <div>
              <p className="font-bold text-gray-900 mb-0.5">Arthur Black</p>
              <p className="text-gray-400 text-xs mb-2">@arthurblack</p>
              <p className="text-sm text-gray-600 leading-relaxed">
                Ipsum adipiscing culpa est nisi consequat ex amet magna culpa mollit laborum fugiat veniam tempor irure ea. Reprehenderit labore do tempor eiusmod in consectetur ex sunt id mollit commodo ipsum deserunt quis.
              </p>
            </div>
          </div>
        </div>

        {/* Comments */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Comments</h2>

          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Add a Comment</h3>
            <div className="border-b border-gray-200 pb-2 mb-4 flex items-center justify-between">
              <input
                type="text" value={comment} onChange={e=>setComment(e.target.value)}
                placeholder="Type your Comment"
                className="flex-1 outline-none text-sm text-gray-700 placeholder:text-gray-400 bg-transparent"
              />
              <button className="flex items-center gap-1.5 text-xs text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 cursor-pointer">
                <Upload size={11}/>Upload
              </button>
            </div>

            {/* Comment preview */}
            <div className="flex gap-3 bg-gray-50 rounded-xl p-4">
              <div className="flex-shrink-0">
                <div className="flex gap-1 mb-1">
                  <div className="w-8 h-8 rounded-full bg-[#C8A000]"/>
                  <div className="w-8 h-8 rounded-full bg-[#888] -ml-3"/>
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-800 border-2 border-white -mt-3"/>
              </div>
              <div className="flex-1 bg-white rounded-xl p-3 shadow-sm">
                <p className="font-semibold text-gray-900 text-sm mb-1">Shaivya S.</p>
                <p className="text-xs text-gray-500 leading-relaxed">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,</p>
                <button className="mt-2 bg-gray-900 text-white text-xs px-4 py-1.5 rounded-lg cursor-pointer">+$XXX</button>
              </div>
              <button className="self-end text-gray-400 hover:text-gray-700 cursor-pointer p-1">→</button>
            </div>
          </div>

          {/* Comments table */}
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-xs text-gray-500 font-medium pb-3 text-left">Name</th>
                <th className="text-xs text-gray-500 font-medium pb-3 text-left">Date Created</th>
                <th className="text-xs text-gray-500 font-medium pb-3 text-left">Quality</th>
                <th className="text-xs text-gray-500 font-medium pb-3 text-left">Comments</th>
                <th className="pb-3"/>
              </tr>
            </thead>
            <tbody>
              {COMMENTS.map((c,i)=>(
                <tr key={i} className="border-b border-gray-50">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#F97316] flex items-center justify-center text-white text-xs font-bold">S</div>
                      <span className="text-sm text-gray-700 font-medium">{c.name}</span>
                    </div>
                  </td>
                  <td className="py-3 text-sm text-gray-500">{c.date}</td>
                  <td className="py-3"><Stars n={c.quality}/></td>
                  <td className="py-3 text-sm text-gray-500">{c.comment}</td>
                  <td className="py-3">
                    <button className="w-6 h-6 rounded-full bg-[#F97316] text-white flex items-center justify-center text-xs cursor-pointer hover:bg-[#ea6c0a]">✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button className="mt-6 w-48 py-3 rounded-xl bg-[#1A1A2E] text-white text-sm font-semibold cursor-pointer hover:bg-[#111] transition-colors">
            Submit
          </button>
        </div>
      </main>
    </div>
  );
}
