"use client";

import AppLayout from "@/components/AppLayout";
import { Search, SlidersHorizontal, TrendingUp, TrendingDown } from "lucide-react";

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
      <text x={cx} y={cy - 6} textAnchor="middle" fill="white" fontSize="10">Total Tasks</text>
      <text x={cx} y={cy + 14} textAnchor="middle" fill="white" fontSize="18" fontWeight="700">277</text>
    </svg>
  );
}

function TrendsChart() {
  return (
    <svg width="100%" height="120" viewBox="0 0 300 120" preserveAspectRatio="none">
      <path d="M0,90 C40,80 80,50 120,60 C160,70 200,30 240,40 L300,20 L300,120 L0,120 Z" fill="rgba(255,255,255,0.07)" />
      <path d="M0,90 C40,80 80,50 120,60 C160,70 200,30 240,40 L300,20" stroke="white" strokeWidth="2" fill="none" />
      <path d="M0,100 C40,95 80,70 120,80 C160,90 200,65 240,72 L300,55" stroke="#888" strokeWidth="1.5" fill="none" strokeDasharray="4 2" />
    </svg>
  );
}

export default function BusinessDashboardPage() {
  return (
    <AppLayout sidebarCollapsed={false}>
      <div className="min-h-screen bg-[#f4f4f4] p-6">
        <div className="flex justify-end mb-6">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-400 w-48">
            <Search size={14} /><span>Search</span>
          </div>
        </div>
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome, Shaivya</h1>
            <p className="text-sm text-gray-500">Business Dashboard Preview</p>
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
            { label: "Payments done", value: "Rs. XYZ", pct: "+39.69%", up: true, emoji: "🪙" },
            { label: "Words ordered", value: "XXX", pct: "-5.23%", up: false, emoji: "📘" },
            { label: "Engagement", value: "50%", pct: "+39.69%", up: true, emoji: "🧩" },
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

        {/* Task Stats + Trends */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-black rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-4">Task Statistic</h3>
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-[#1a1a1a] rounded-xl p-3 text-center">
                <p className="text-gray-400 text-xs mb-1">Total Tasks</p>
                <p className="text-white text-2xl font-bold">476</p>
              </div>
              <div className="bg-[#1a1a1a] rounded-xl p-3 text-center">
                <p className="text-gray-400 text-xs mb-1">Overdue Tasks</p>
                <p className="text-white text-2xl font-bold">23</p>
              </div>
            </div>
            <div className="flex justify-center mb-4"><DonutChart /></div>
            <div className="space-y-2">
              {[{label:"Complete",count:186,color:"bg-gray-200"},{label:"Inprogress",count:47,color:"bg-gray-500"},{label:"Pending",count:54,color:"bg-gray-700"}].map(item => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><div className={`w-2 h-2 rounded-full ${item.color}`} /><span className="text-gray-400 text-xs">{item.label}</span></div>
                  <span className="text-gray-300 text-xs font-semibold">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-black rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-white">Trends</span>
              <div className="flex items-center gap-1 text-red-400 text-xs"><TrendingDown size={12} /><span>-5.23%</span></div>
            </div>
            <TrendsChart />
            <div className="mt-4 flex divide-x divide-gray-700">
              {[{label:"Impressions",val:"12k"},{label:"Clicks",val:"4.5k"},{label:"Conversions",val:"890"}].map(item => (
                <div key={item.label} className="flex-1 text-center px-2">
                  <p className="text-lg font-bold text-white">{item.val}</p>
                  <p className="text-xs text-gray-400">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Revenue chart */}
        <div className="bg-white rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-800">Revenue Overview</h3>
            <div className="flex items-center gap-1 text-green-600 text-xs"><TrendingUp size={12} /><span>+12.4% this month</span></div>
          </div>
          <svg width="100%" height="100" viewBox="0 0 500 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="revGrad" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#111" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#111" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0,70 C60,60 120,20 180,35 C240,50 300,15 360,25 C420,35 460,20 500,10 L500,100 L0,100 Z" fill="url(#revGrad)" />
            <path d="M0,70 C60,60 120,20 180,35 C240,50 300,15 360,25 C420,35 460,20 500,10" stroke="#111" strokeWidth="2" fill="none" />
            {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug"].map((m,i) => (
              <text key={m} x={10 + i * 70} y={98} fill="#aaa" fontSize="9">{m}</text>
            ))}
          </svg>
        </div>
      </div>
    </AppLayout>
  );
}
