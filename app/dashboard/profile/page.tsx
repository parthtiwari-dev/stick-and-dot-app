"use client";

import AppLayout from "@/components/AppLayout";
import Link from "next/link";
import { Search, SlidersHorizontal, TrendingUp, TrendingDown, Star } from "lucide-react";

function DonutChart() {
  const r = 54; const cx = 70; const cy = 70;
  const circ = 2 * Math.PI * r;
  const completeDash = (186 / 277) * circ;
  const inprogressDash = (47 / 277) * circ;
  return (
    <svg width="140" height="140" viewBox="0 0 140 140">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#333" strokeWidth="16" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e5e5" strokeWidth="16"
        strokeDasharray={`${completeDash} ${circ - completeDash}`} strokeDashoffset={circ * 0.25} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#888" strokeWidth="16"
        strokeDasharray={`${inprogressDash} ${circ - inprogressDash}`} strokeDashoffset={circ * 0.25 - completeDash} strokeLinecap="round" />
      <text x={cx} y={cy - 6} textAnchor="middle" fill="white" fontSize="10">Complete Task</text>
      <text x={cx} y={cy + 14} textAnchor="middle" fill="white" fontSize="18" fontWeight="700">186 Task</text>
    </svg>
  );
}

function PerfChart() {
  return (
    <svg width="100%" height="130" viewBox="0 0 320 130" preserveAspectRatio="none">
      {[100,80,60,40,20,0].map((y,i) => (
        <g key={i}>
          <text x="0" y={10+i*22} fill="#aaa" fontSize="9">{100-i*20}</text>
          <line x1="24" y1={10+i*22} x2="320" y2={10+i*22} stroke="#e5e5e5" strokeWidth="0.5" />
        </g>
      ))}
      <polyline points="30,90 75,60 120,65 165,50 210,68 255,60 300,62" stroke="#ccc" strokeWidth="1.5" fill="none" strokeDasharray="4 2" />
      <polyline points="30,100 75,80 120,75 165,70 210,80 255,75 300,78" stroke="#555" strokeWidth="1.5" fill="none" />
      {["Jan","Feb","Mar","Apr","May","Jun"].map((m,i) => (
        <text key={m} x={30+i*54} y={128} fill="#aaa" fontSize="9" textAnchor="middle">{m}</text>
      ))}
      <g>
        <circle cx="170" cy="8" r="4" fill="#ccc" />
        <text x="180" y="12" fill="#aaa" fontSize="8">Total Sales</text>
        <circle cx="230" cy="8" r="4" fill="#555" />
        <text x="240" y="12" fill="#aaa" fontSize="8">Total Revenue</text>
      </g>
    </svg>
  );
}

function Sparkline({ up }: { up: boolean }) {
  return (
    <svg width="50" height="20" viewBox="0 0 50 20" fill="none">
      {up
        ? <polyline points="0,18 12,12 24,16 36,7 50,5" stroke="#4ade80" strokeWidth="2" fill="none" />
        : <polyline points="0,5 12,8 24,6 36,14 50,18" stroke="#f87171" strokeWidth="2" fill="none" />
      }
    </svg>
  );
}

function ProfileContent() {
  return (
    <div className="min-h-screen bg-[#f4f4f4] p-6">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-4">
        <nav className="text-sm text-gray-500">
          <Link href="/dashboard" className="hover:text-black">Dashboard</Link>
          <span className="mx-1">&gt;</span>
          <span className="text-gray-800 font-medium">Profile</span>
        </nav>
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-400 w-48">
          <Search size={14} /><span>Search</span>
        </div>
      </div>

      {/* Welcome */}
      <div className="flex items-start justify-between mb-5">
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

      {/* Profile + KPI cards */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {/* Profile Card */}
        <div className="bg-black rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gray-600 overflow-hidden shrink-0">
              <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-700" />
            </div>
            <div className="flex-1">
              <p className="text-white font-semibold">Jerome Bell</p>
              <p className="text-gray-400 text-xs">Marketing Coordinator</p>
            </div>
            <button className="text-[11px] bg-white/10 text-gray-300 px-3 py-1 rounded-full border border-white/20 hover:bg-white/20 transition-colors">Switch Profile</button>
          </div>
          <div className="space-y-2 text-xs text-gray-400 mb-4">
            <div className="flex gap-2"><span className="text-gray-500 w-16">Phone</span><span className="text-gray-300">+6281325132288</span></div>
            <div className="flex gap-2"><span className="text-gray-500 w-16">Email</span><span className="text-gray-300">richardtyson@gmail.com</span></div>
            <div className="flex gap-2"><span className="text-gray-500 w-16">Address</span><span className="text-gray-300">Merdeka Street, Wonosobo</span></div>
          </div>
          <div className="mb-4">
            <p className="text-gray-500 text-xs mb-1">Description</p>
            <p className="text-gray-400 text-xs leading-relaxed line-clamp-3">I'm the CEO at Tokopedia. Establishing an application myself is my goal. I want to help ...</p>
          </div>
          <div className="flex gap-2">
            <button className="flex-1 bg-white/10 text-gray-200 text-xs py-2 rounded-lg hover:bg-white/20 transition-colors">Go to Details</button>
            <button className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-gray-300 hover:bg-white/20 transition-colors">⋯</button>
          </div>
        </div>

        {/* 4 KPI cards in 2x2 grid */}
        <div className="col-span-2 grid grid-cols-2 gap-4">
          {[
            { label: "Payments done", value: "Rs. XYZ", pct: "+39.69%", up: true, emoji: "🪙" },
            { label: "Words ordered", value: "XXX", pct: "-5.23%", up: false, emoji: "📘" },
            { label: "Engagement so far", value: "50%", pct: "+39.69%", up: true, emoji: "🧩" },
            { label: "Words pending", value: "XXX", pct: "-5.23%", up: false, emoji: "📘" },
          ].map((kpi) => (
            <div key={kpi.label} className="bg-black rounded-2xl p-4 flex items-start gap-3">
              <div className="text-xl">{kpi.emoji}</div>
              <div className="flex-1">
                <p className="text-xs text-gray-400 mb-1">{kpi.label}</p>
                <p className="text-xl font-bold text-white mb-2">{kpi.value}</p>
                <div className="flex items-center gap-1">
                  <Sparkline up={kpi.up} />
                  <span className={`text-xs ${kpi.up ? "text-green-400" : "text-red-400"}`}>{kpi.pct}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Task Statistic + Content Performance */}
      <div className="grid grid-cols-2 gap-4">
        {/* Task Statistic */}
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
          <div className="flex justify-center mb-4">
            <DonutChart />
          </div>
          <div className="space-y-2">
            {[
              { label: "Complete Task", count: 186, color: "bg-gray-200" },
              { label: "Inprogress Task", count: 47, color: "bg-gray-500" },
              { label: "Pending Task", count: 54, color: "bg-gray-700" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${item.color}`} />
                  <span className="text-gray-400 text-xs">{item.label}</span>
                </div>
                <span className="text-gray-300 text-xs font-semibold">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Content Performance */}
        <div className="bg-white rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-800 font-semibold text-sm">Content Performance Overview</h3>
            <div className="flex items-center gap-1 border border-gray-200 text-gray-500 text-xs px-2 py-1 rounded">
              <span>month</span>
              <span>▾</span>
            </div>
          </div>
          <PerfChart />
        </div>
      </div>
    </div>
  );
}

export default function DashboardProfilePage() {
  return (
    <AppLayout sidebarCollapsed={true}>
      <ProfileContent />
    </AppLayout>
  );
}
