"use client";

import AppLayout from "@/components/AppLayout";
import { Search, SlidersHorizontal, BookOpen, TrendingUp } from "lucide-react";

function Sparkline({ up }: { up: boolean }) {
  return (
    <svg width="60" height="24" viewBox="0 0 60 24" fill="none">
      {up
        ? <polyline points="0,20 10,15 20,18 30,10 40,14 50,6 60,8" stroke="#4ade80" strokeWidth="2" fill="none" />
        : <polyline points="0,6 10,10 20,8 30,14 40,10 50,18 60,20" stroke="#f87171" strokeWidth="2" fill="none" />}
    </svg>
  );
}

function ProgressRing({ pct, color }: { pct: number; color: string }) {
  const r = 36, circ = 2 * Math.PI * r, dash = (pct / 100) * circ;
  return (
    <svg width="90" height="90" viewBox="0 0 90 90">
      <circle cx="45" cy="45" r={r} fill="none" stroke="#333" strokeWidth="10" />
      <circle cx="45" cy="45" r={r} fill="none" stroke={color} strokeWidth="10"
        strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={circ * 0.25} strokeLinecap="round" />
      <text x="45" y="49" textAnchor="middle" fill="white" fontSize="14" fontWeight="700">{pct}%</text>
    </svg>
  );
}

export default function ReaderDashboardPage() {
  return (
    <AppLayout sidebarCollapsed={true}>
      <div className="min-h-screen bg-[#f4f4f4] p-6">
        <div className="flex justify-end mb-6">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-400 w-48">
            <Search size={14} /><span>Search</span>
          </div>
        </div>
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome, Shaivya</h1>
            <p className="text-sm text-gray-500">Your Dashboard Preview</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="bg-black text-white text-xs font-semibold px-4 py-2 rounded-full">Today</button>
            <button className="bg-white text-gray-600 text-xs font-medium px-4 py-2 rounded-full border border-gray-200">Select Date</button>
            <button className="bg-white text-gray-600 text-xs font-medium px-4 py-2 rounded-full border border-gray-200 flex items-center gap-1">
              <SlidersHorizontal size={12} />Filter
            </button>
          </div>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {[
            { label: "Articles read", value: "XXX", pct: "+39.69%", up: true, emoji: "📖" },
            { label: "Reading streak", value: "XXX", pct: "-5.23%", up: false, emoji: "🔥" },
            { label: "Completion rate", value: "50%", pct: "+39.69%", up: true, emoji: "✅" },
          ].map((kpi) => (
            <div key={kpi.label} className="bg-black rounded-2xl p-4 flex items-start gap-3">
              <div className="text-2xl">{kpi.emoji}</div>
              <div className="flex-1">
                <p className="text-xs text-gray-400 mb-1">{kpi.label}</p>
                <p className="text-2xl font-bold text-white mb-2">{kpi.value}</p>
                <div className="flex items-center gap-1">
                  <Sparkline up={kpi.up} />
                  <span className={`text-xs font-medium ${kpi.up ? "text-green-400" : "text-red-400"}`}>{kpi.pct}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Reading Progress */}
        <div className="bg-black rounded-2xl p-5 mb-4 flex items-center gap-8">
          <div>
            <p className="text-xs text-gray-400 mb-1">Reading Progress</p>
            <p className="text-white text-sm">Your article completion this week</p>
          </div>
          <div className="flex gap-6 ml-auto">
            <div className="flex flex-col items-center gap-1">
              <ProgressRing pct={68} color="#e5e5e5" />
              <p className="text-xs text-gray-400">This Week</p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <ProgressRing pct={45} color="#888" />
              <p className="text-xs text-gray-400">Last Week</p>
            </div>
          </div>
        </div>

        {/* Recent + Recommended */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen size={16} className="text-gray-600" />
              <span className="text-sm font-semibold text-gray-800">Recently Read</span>
            </div>
            {[1,2,3,4].map(n => (
              <div key={n} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-800">Article Name {n}</p>
                  <p className="text-xs text-gray-400">Author Name • 5 min read</p>
                </div>
                <span className="text-xs text-gray-400">2d ago</span>
              </div>
            ))}
          </div>
          <div className="bg-black rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={16} className="text-gray-400" />
              <span className="text-sm font-semibold text-white">Recommended</span>
            </div>
            {[1,2,3,4].map(n => (
              <div key={n} className="flex items-center justify-between py-3 border-b border-gray-700 last:border-0">
                <div>
                  <p className="text-sm font-medium text-white">Article Name {n}</p>
                  <p className="text-xs text-gray-400">Category • 8 min read</p>
                </div>
                <button className="text-xs bg-white/10 text-gray-300 px-2 py-1 rounded-lg hover:bg-white/20 transition-colors">Read</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
