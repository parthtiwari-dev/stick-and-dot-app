"use client";

import AppLayout from "@/components/AppLayout";
import { Search, ChevronDown, SlidersHorizontal, Star, TrendingUp, TrendingDown } from "lucide-react";

function Sparkline({ up }: { up: boolean }) {
  return (
    <svg width="60" height="24" viewBox="0 0 60 24" fill="none">
      {up
        ? <polyline points="0,20 10,15 20,18 30,10 40,14 50,6 60,8" stroke="#4ade80" strokeWidth="2" fill="none" />
        : <polyline points="0,6 10,10 20,8 30,14 40,10 50,18 60,20" stroke="#f87171" strokeWidth="2" fill="none" />}
    </svg>
  );
}

function DonutChart() {
  const r = 54, cx = 70, cy = 70, circ = 2 * Math.PI * r;
  const completeDash = (186 / 277) * circ, inprogressDash = (47 / 277) * circ;
  return (
    <svg width="140" height="140" viewBox="0 0 140 140">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#333" strokeWidth="16" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e5e5" strokeWidth="16" strokeDasharray={`${completeDash} ${circ - completeDash}`} strokeDashoffset={circ * 0.25} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#888" strokeWidth="16" strokeDasharray={`${inprogressDash} ${circ - inprogressDash}`} strokeDashoffset={circ * 0.25 - completeDash} strokeLinecap="round" />
      <text x={cx} y={cy - 6} textAnchor="middle" fill="white" fontSize="10">Complete Task</text>
      <text x={cx} y={cy + 14} textAnchor="middle" fill="white" fontSize="18" fontWeight="700">186 Task</text>
    </svg>
  );
}

function TrendsChart() {
  return (
    <svg width="100%" height="120" viewBox="0 0 300 120" preserveAspectRatio="none">
      <defs>
        <linearGradient id="tg" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity="0.15" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M0,80 C30,70 60,30 90,50 C120,70 150,20 180,40 C210,60 240,30 270,20 L300,15 L300,120 L0,120 Z" fill="url(#tg)" />
      <path d="M0,80 C30,70 60,30 90,50 C120,70 150,20 180,40 C210,60 240,30 270,20 L300,15" stroke="white" strokeWidth="2" fill="none" />
    </svg>
  );
}

function MiniBarChart() {
  const bars = [40, 55, 35, 70, 50, 45, 60];
  return (
    <svg width="100" height="50" viewBox="0 0 100 50">
      {bars.map((h, i) => <rect key={i} x={i * 14 + 2} y={50 - (h / 100) * 40 - 8} width="10" height={(h / 100) * 40 + 4} rx="2" fill={i === 6 ? "white" : "#555"} />)}
    </svg>
  );
}

function PieChart() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80">
      <circle cx="40" cy="40" r="30" fill="none" stroke="#555" strokeWidth="20" />
      <circle cx="40" cy="40" r="30" fill="none" stroke="#888" strokeWidth="20" strokeDasharray="60 188" strokeDashoffset="47" />
      <circle cx="40" cy="40" r="30" fill="none" stroke="#aaa" strokeWidth="20" strokeDasharray="40 188" strokeDashoffset="-13" />
      <text x="40" y="40" textAnchor="middle" fill="white" fontSize="8" dy="3">xyz</text>
    </svg>
  );
}

export default function WriterDashboardPage() {
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
            { label: "Payments received", value: "Rs. XYZ", pct: "+39.69%", up: true, emoji: "🪙" },
            { label: "Words written", value: "XXX", pct: "-5.23%", up: false, emoji: "📘" },
            { label: "Engagement so far", value: "50%", pct: "+39.69%", up: true, emoji: "🧩" },
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

        {/* Overall feedback */}
        <div className="bg-black rounded-2xl p-5 mb-4 flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🏆</div>
            <div>
              <p className="text-xs text-gray-400">Overall feedback</p>
              <p className="text-3xl font-bold text-white">12k</p>
              <p className="text-xs text-gray-400">Feedbacks</p>
            </div>
          </div>
          <div className="flex gap-0.5">
            {[1,2,3,4,5].map(s => <Star key={s} size={20} className="text-yellow-400 fill-yellow-400" />)}
          </div>
          <div className="ml-auto bg-[#2a2a2a] rounded-xl p-3 flex items-center gap-3 w-64">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-600" />
            <div className="flex-1">
              <p className="text-white text-xs font-semibold">Shaivya S.</p>
              <p className="text-gray-400 text-[10px] line-clamp-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              <span className="text-[10px] bg-black text-gray-300 px-2 py-0.5 rounded-full mt-1 inline-block">+$XXX</span>
            </div>
          </div>
        </div>

        {/* Top Articles + Trends */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-gray-800">Your Top Articles</span>
              <button className="text-xs text-gray-400">Details</button>
            </div>
            {[1,2,3].map(n => (
              <div key={n} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-500">#{n}</span>
                  <span className="text-sm text-gray-800">Article Name</span>
                </div>
                <div className="text-right">
                  <div className="flex gap-0.5 justify-end">
                    {[1,2,3,4,5].map(s => <Star key={s} size={10} className="text-yellow-400 fill-yellow-400" />)}
                  </div>
                  <p className="text-[11px] text-gray-400">12K Views</p>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-black rounded-2xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-white">Trends</span>
              <div className="flex items-center gap-1 text-red-400 text-xs">
                <TrendingDown size={12} /><span>-5.23%</span>
              </div>
            </div>
            <TrendsChart />
          </div>
        </div>

        {/* Engagement + Category + Audience */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-white rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-800">Engagement</span>
            </div>
            <div className="flex gap-4 text-xs mb-3">
              <div><p className="text-gray-400">This Week</p><p className="font-semibold text-green-600">+20%</p></div>
              <div><p className="text-gray-400">Last Week</p><p className="font-semibold text-red-500">-10%</p></div>
            </div>
            <MiniBarChart />
          </div>
          <div className="bg-white rounded-2xl p-5">
            <span className="text-sm font-semibold text-gray-800">Top Category</span>
            {[1,2,3].map(i => (
              <div key={i} className="flex items-center gap-3 py-2.5 border-b border-gray-100 last:border-0">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm">⊙</div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Category Name</p>
                  <p className="text-xs text-gray-400">Popularity 10.1K</p>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-black rounded-2xl p-5">
            <span className="text-sm font-semibold text-white">Audience</span>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex-1 space-y-2">
                {["Lorem Ipsum","Lorem Ipsum","Lorem Ipsum","Lorem Ipsum"].map((l,i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${["bg-gray-300","bg-gray-500","bg-gray-600","bg-gray-700"][i]}`} />
                    <span className="text-[11px] text-gray-400">{l}</span>
                  </div>
                ))}
              </div>
              <PieChart />
            </div>
          </div>
        </div>

        {/* Feedback */}
        <div>
          <h2 className="text-base font-semibold text-gray-800 mb-3">Feedback</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 bg-black rounded-2xl p-5">
              <p className="text-white text-sm font-semibold text-center mb-4">Your Recent Performance</p>
              <div className="flex divide-x divide-gray-700">
                {[{label:"impressions",val:"12k"},{label:"Likes",val:"12k"},{label:"Feedbacks",val:"12k"}].map((item) => (
                  <div key={item.label} className="flex-1 text-center px-4">
                    <p className="text-2xl font-bold text-white">{item.val}</p>
                    <p className="text-xs text-gray-400 mt-1">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-black rounded-2xl p-5 flex flex-col items-center justify-center">
              <p className="text-white text-sm font-semibold mb-1">Overall</p>
              <p className="text-3xl font-bold text-white mb-2">4.5/5</p>
              <div className="flex gap-0.5">
                {[1,2,3,4].map(s => <Star key={s} size={16} className="text-yellow-400 fill-yellow-400" />)}
                <Star size={16} className="text-yellow-400 fill-yellow-400 opacity-50" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
