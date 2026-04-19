"use client";
import { useUser } from "@/components/UserContext";
import AppLayout from "@/components/AppLayout";
import { Search, TrendingUp, TrendingDown } from "lucide-react";

const TOP_ARTICLES = [
  { rank:1, title:"The Future of EVs in India",           views:"18.4K", rating:4.8 },
  { rank:2, title:"Top 10 Finance Hacks for Gen-Z",       views:"11.2K", rating:4.5 },
  { rank:3, title:"AI in Healthcare: What Doctors Say",   views:"9.7K",  rating:4.7 },
];

export default function BusinessDashboard() {
  const { userName } = useUser();
  return (
    <AppLayout bg="bg-[#F4F4F4]">
      <div className="p-6 min-h-screen">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1 gap-3">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Dashboard&gt;Profile</p>
            <h1 className="text-2xl font-bold text-gray-900">Welcome, {userName}</h1>
            <p className="text-sm text-gray-500">Your Dashboard Preview</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex gap-2">
              <button className="bg-[#111] text-white text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer">Today</button>
              <button className="bg-white border border-gray-200 text-gray-600 text-xs px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-50">Select Date</button>
              <button className="bg-white border border-gray-200 text-gray-600 text-xs px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-50 flex items-center gap-1">
                <span>▼</span> Filter
              </button>
            </div>
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-400 w-40">
              <Search size={13}/><span>Search</span>
            </div>
          </div>
        </div>

        {/* Stat Cards — Words Ordered / Words Pending / Payment Done */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5 mb-4">
          {[
            { label:"Words Ordered",         value:"84,200", icon:"📋", change:"+22.4%",  up:true  },
            { label:"Words Pending Delivery", value:"12,400", icon:"⏳", change:"-8.3%",   up:false },
            { label:"Payment Done",           value:"₹62,500", icon:"🪙", change:"+31.2%", up:true  },
          ].map(({ label, value, icon, change, up }) => (
            <div key={label} className="bg-[#1A1A1A] rounded-2xl p-5 text-white flex items-center gap-4">
              <div className="text-3xl">{icon}</div>
              <div>
                <p className="text-xs text-gray-400 mb-1">{label}</p>
                <p className="text-2xl font-bold">{value}</p>
                <p className={`text-xs mt-1 flex items-center gap-1 ${up?"text-green-400":"text-red-400"}`}>
                  {up?<TrendingUp size={11}/>:<TrendingDown size={11}/>} {change}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Row 2 — Top Performing Articles + Traffic Graph */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
          {/* Top Performing Articles */}
          <div className="md:col-span-2 bg-white rounded-2xl p-5 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <p className="font-semibold text-gray-900 text-sm">Top Performing Articles</p>
              <button className="text-xs text-gray-400 hover:text-gray-700 cursor-pointer">Details</button>
            </div>
            {TOP_ARTICLES.map(a => (
              <div key={a.rank} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-gray-400">#{a.rank}</span>
                  <div>
                    <p className="text-sm text-gray-800 font-medium leading-tight line-clamp-2">{a.title}</p>
                    <p className="text-xs text-gray-400">{a.views} views</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-xs font-semibold text-gray-700">⭐ {a.rating}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Traffic / Engagement Graph */}
          <div className="md:col-span-3 bg-[#1A1A1A] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <p className="text-white text-sm font-semibold">📈 Traffic</p>
                <span className="text-green-400 text-xs flex items-center gap-1"><TrendingUp size={11}/>+4.0%</span>
              </div>
              <select className="bg-[#2A2A2A] text-gray-300 text-xs px-3 py-1.5 rounded-lg outline-none cursor-pointer border-0">
                <option>Views</option><option>Engagement</option>
              </select>
            </div>
            <div className="relative h-44 w-full">
              <svg viewBox="0 0 400 160" className="w-full h-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="trafficGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.12"/>
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                {[40,80,120].map(y => (
                  <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="#2a2a2a" strokeWidth="1"/>
                ))}
                <path d="M0,120 C60,110 80,80 120,70 C160,60 180,90 220,60 C260,30 300,50 340,40 C370,33 390,38 400,35"
                  stroke="#ffffff" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                <path d="M0,120 C60,110 80,80 120,70 C160,60 180,90 220,60 C260,30 300,50 340,40 C370,33 390,38 400,35 L400,160 L0,160 Z"
                  fill="url(#trafficGrad)"/>
                {["Jan","Feb","Mar","Apr","May","Jun"].map((m,i) => (
                  <text key={m} x={i*66+20} y="155" fill="#6b7280" fontSize="9">{m}</text>
                ))}
              </svg>
            </div>
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
