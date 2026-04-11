"use client";
import AppLayout from "@/components/AppLayout";
import Footer from "@/components/Footer";
import { Search, TrendingUp, TrendingDown } from "lucide-react";

const ARTICLES = [
  { rank: 1, name: "Article Name", rating: 5, views: "1.2K Views" },
  { rank: 2, name: "Article Name", rating: 4, views: "1.2K Views" },
  { rank: 3, name: "Article Name", rating: 4, views: "1.2K Views" },
];

const PROJECTS = [
  { name: "Finalize Ist Version", progress: 65, budget: "$14,000", completion: "65%" },
  { name: "Add Progress Track",   progress: 10, budget: "$5,000",  completion: "10%" },
  { name: "Fix Platform Errors",  progress: 10, budget: "Refund",  completion: "10%" },
  { name: "Update the Mobile App",progress: 100,budget: "$52,500", completion: "100%" },
  { name: "Add the Pricing Page", progress: 5,  budget: "$400",    completion: "5%" },
  { name: "Redesign New Online Shop",progress: 45, budget: "$7,000", completion: "45%" },
];

const BOOKMARKS = [
  { name: "Article Name", pct: 90 },
  { name: "Article Name", pct: 70 },
  { name: "Article Name", pct: 55 },
];

const CALENDAR_DAYS = [
  ["","","","29","30","1"],
  ["2","3","4","5","6","7","8"],
  ["9","10","11","12","13","14","15"],
  ["16","17","18","19","20","21","22"],
  ["23","24","25","26","27","28","29"],
  ["30","31","1","2","3","4","5"],
];

export default function ReaderDashboard() {
  return (
    <AppLayout bg="bg-[#F4F4F4]">
      <div className="p-6 min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Dashboard&gt;Profile</p>
            <h1 className="text-2xl font-bold text-gray-900">Welcome, Shaivya</h1>
            <p className="text-sm text-gray-500">Your Dashboard Preview</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              <button className="bg-[#111] text-white text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer">Today</button>
              <button className="bg-white border border-gray-200 text-gray-600 text-xs px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-50">Select Date</button>
              <button className="bg-white border border-gray-200 text-gray-600 text-xs px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-50 flex items-center gap-1">
                <span>▼</span> Filter
              </button>
            </div>
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-400 w-40">
              <Search size={13} /><span>Search</span>
            </div>
          </div>
        </div>

        {/* Top Stat Cards */}
        <div className="grid grid-cols-3 gap-4 mt-5 mb-4">
          {[
            { label: "Content Read", value: "Rs. XYZ", icon: "📘", change: "+39.89%", up: true },
            { label: "Feedback", value: "XXX", icon: "💬", change: "-5.23%", up: false },
            { label: "Understanding Meter", value: "50%", icon: "💡", change: "+30.03%", up: true },
          ].map(({ label, value, icon, change, up }) => (
            <div key={label} className="bg-[#1A1A1A] rounded-2xl p-5 text-white flex items-center gap-4">
              <div className="text-3xl">{icon}</div>
              <div>
                <p className="text-xs text-gray-400 mb-1">{label}</p>
                <p className="text-2xl font-bold">{value}</p>
                <p className={`text-xs mt-1 flex items-center gap-1 ${up ? "text-green-400" : "text-red-400"}`}>
                  {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />} {change}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Middle Row */}
        <div className="grid grid-cols-5 gap-4 mb-4">
          {/* Top Articles */}
          <div className="col-span-2 bg-white rounded-2xl p-5 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <p className="font-semibold text-gray-900 text-sm">Your Top Articles</p>
              <button className="text-xs text-gray-400 hover:text-gray-700 cursor-pointer">Details</button>
            </div>
            {ARTICLES.map(a => (
              <div key={a.rank} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-500">#{a.rank}</span>
                  <span className="text-sm text-gray-800">{a.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">{a.views}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Understanding Meter */}
          <div className="col-span-3 bg-[#1A1A1A] rounded-2xl p-5">
            <p className="text-white text-sm font-semibold mb-4">Understanding Meter</p>
            <div className="flex items-center gap-6">
              {/* Gauge */}
              <div className="relative w-36 h-36 flex-shrink-0">
                <svg viewBox="0 0 120 120" className="w-full h-full">
                  <circle cx="60" cy="60" r="48" fill="none" stroke="#2a2a2a" strokeWidth="12" />
                  <circle cx="60" cy="60" r="48" fill="none" stroke="#ffffff" strokeWidth="12"
                    strokeDasharray="180 302" strokeLinecap="round" transform="rotate(-90 60 60)" />
                  <text x="60" y="55" textAnchor="middle" fill="white" fontSize="18" fontWeight="700">68%</text>
                  <text x="60" y="70" textAnchor="middle" fill="#9ca3af" fontSize="8">Current Reading</text>
                </svg>
              </div>
              <div>
                <p className="text-white text-5xl font-bold mb-1">68%</p>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
                </p>
                <p className="text-gray-400 text-xs mt-3">❓ How is understanding meter calculated?</p>
                <p className="text-gray-500 text-xs mt-1 leading-relaxed">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt</p>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar + Projects */}
        <div className="grid grid-cols-5 gap-4 mb-4">
          {/* Calendar */}
          <div className="col-span-2 bg-white rounded-2xl p-5 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <p className="font-semibold text-gray-900 text-sm">📅 Calendar</p>
              <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-lg">October</span>
            </div>
            <div className="grid grid-cols-7 gap-0">
              {["Mo","Tu","We","Th","Fr","Sa","Su"].map(d => (
                <div key={d} className="text-center text-xs text-gray-400 font-medium py-1">{d}</div>
              ))}
              {CALENDAR_DAYS.flat().map((d, i) => (
                <div key={i}
                  className={`text-center text-xs py-1.5 rounded-lg cursor-pointer ${
                    d === "13" ? "bg-[#111] text-white font-bold" :
                    ["14","15"].includes(d) ? "text-[#F97316] font-semibold" :
                    d === "" ? "" : "text-gray-700 hover:bg-gray-50"
                  }`}>
                  {d}
                </div>
              ))}
            </div>
          </div>

          {/* Projects */}
          <div className="col-span-3 bg-white rounded-2xl p-5 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <p className="font-semibold text-gray-900 text-sm">Projects</p>
              <span className="text-green-500 text-xs flex items-center gap-1"><TrendingUp size={11} /> +20.89%</span>
            </div>
            <div className="grid grid-cols-4 gap-2 mb-2">
              {["Overview","Leaders","Joiners","Completed"].map(h => (
                <p key={h} className="text-xs text-gray-400 font-medium">{h}</p>
              ))}
            </div>
            {PROJECTS.map(p => (
              <div key={p.name} className="grid grid-cols-4 gap-2 items-center py-2 border-b border-gray-50 last:border-0">
                <p className="text-xs text-gray-700 font-medium col-span-1">{p.name}</p>
                <div className="flex -space-x-1">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-5 h-5 rounded-full bg-gradient-to-br from-orange-300 to-orange-600 border-2 border-white" />
                  ))}
                </div>
                <p className="text-xs text-gray-600">{p.budget}</p>
                <div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div className="bg-[#111] h-1.5 rounded-full" style={{width: p.completion}} />
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{p.completion}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rating + Bookmarks + Genre */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {/* Your Rating */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100">
            <p className="font-semibold text-gray-900 text-sm mb-1">Your Rating</p>
            <p className="text-xs text-gray-400 mb-4">Lorem ipsum dolor sit amet consectetur</p>
            <div className="flex items-center gap-4">
              <div className="relative w-24 h-24">
                <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
                  <circle cx="40" cy="40" r="30" fill="none" stroke="#f3f4f6" strokeWidth="10" />
                  <circle cx="40" cy="40" r="30" fill="none" stroke="#111" strokeWidth="10"
                    strokeDasharray="160 188" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xs text-gray-500 font-medium">85%</span>
                  <span className="text-xs text-gray-400">GENRE</span>
                </div>
              </div>
              <div className="relative w-24 h-24">
                <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
                  <circle cx="40" cy="40" r="30" fill="none" stroke="#f3f4f6" strokeWidth="10" />
                  <circle cx="40" cy="40" r="30" fill="none" stroke="#555" strokeWidth="10"
                    strokeDasharray="173 188" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xs text-gray-500 font-medium">92%</span>
                  <span className="text-xs text-gray-400">GENRE</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bookmarks */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100">
            <p className="font-semibold text-gray-900 text-sm mb-4">Bookmarks</p>
            {BOOKMARKS.map((b, i) => (
              <div key={i} className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-700">{b.name}</span>
                  <span className="text-xs text-gray-400">{b.pct}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div className="bg-[#111] h-1.5 rounded-full" style={{width:`${b.pct}%`}} />
                </div>
              </div>
            ))}
          </div>

          {/* Genre */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <p className="font-semibold text-gray-900 text-sm">Genre</p>
              <button className="text-xs text-gray-400 hover:text-gray-700 cursor-pointer">Details</button>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex flex-col gap-2">
                {[{id:1,l:"Lorem Ipsum"},{id:2,l:"Lorem Ipsum"},{id:3,l:"Lorem Ipsum"}].map(({id,l},i) => (
                  <div key={id} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{background:["#111","#555","#999"][i]}} />
                    <span className="text-xs text-gray-500">{l}</span>
                  </div>
                ))}
              </div>
              <div className="relative w-20 h-20 ml-auto">
                <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
                  <circle cx="40" cy="40" r="28" fill="none" stroke="#f3f4f6" strokeWidth="14" />
                  <circle cx="40" cy="40" r="28" fill="none" stroke="#111" strokeWidth="14" strokeDasharray="60 116" />
                  <circle cx="40" cy="40" r="28" fill="none" stroke="#555" strokeWidth="14" strokeDasharray="40 136" strokeDashoffset="-60" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-700">68</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </AppLayout>
  );
}
