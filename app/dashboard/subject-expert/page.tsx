"use client";

import AppLayout from "@/components/AppLayout";
import { Search, SlidersHorizontal, Star, CheckCircle } from "lucide-react";

function Sparkline({ up }: { up: boolean }) {
  return (
    <svg width="60" height="24" viewBox="0 0 60 24" fill="none">
      {up
        ? <polyline points="0,20 10,15 20,18 30,10 40,14 50,6 60,8" stroke="#4ade80" strokeWidth="2" fill="none" />
        : <polyline points="0,6 10,10 20,8 30,14 40,10 50,18 60,20" stroke="#f87171" strokeWidth="2" fill="none" />}
    </svg>
  );
}

export default function SubjectExpertDashboardPage() {
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
            <p className="text-sm text-gray-500">Subject Expert Dashboard</p>
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
            { label: "Reviews completed", value: "XXX", pct: "+39.69%", up: true, emoji: "🔬" },
            { label: "Avg. rating given", value: "4.8", pct: "+5.23%", up: true, emoji: "⭐" },
            { label: "Accuracy rate", value: "96%", pct: "+2.1%", up: true, emoji: "🎯" },
          ].map((kpi) => (
            <div key={kpi.label} className="bg-black rounded-2xl p-4 flex items-start gap-3">
              <div className="text-2xl">{kpi.emoji}</div>
              <div className="flex-1">
                <p className="text-xs text-gray-400 mb-1">{kpi.label}</p>
                <p className="text-2xl font-bold text-white mb-2">{kpi.value}</p>
                <div className="flex items-center gap-1">
                  <Sparkline up={kpi.up} />
                  <span className="text-xs font-medium text-green-400">{kpi.pct}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pending Reviews */}
        <div className="bg-black rounded-2xl p-5 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Pending Reviews</h3>
            <span className="text-xs bg-white/10 text-gray-300 px-3 py-1 rounded-full">8 pending</span>
          </div>
          <div className="space-y-3">
            {[1,2,3,4].map(n => (
              <div key={n} className="flex items-center justify-between bg-[#1a1a1a] rounded-xl p-3">
                <div>
                  <p className="text-white text-sm font-medium">Article Title {n}</p>
                  <p className="text-gray-400 text-xs">Due: 2 days · Category Name</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">1,200 words</span>
                  <button className="text-xs bg-white text-black px-3 py-1 rounded-lg font-medium hover:bg-gray-100 transition-colors">Review</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Completed + Rating */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle size={16} className="text-gray-600" />
              <span className="text-sm font-semibold text-gray-800">Recently Completed</span>
            </div>
            {[1,2,3,4].map(n => (
              <div key={n} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-800">Article Title {n}</p>
                  <p className="text-xs text-gray-400">Reviewed 2d ago</p>
                </div>
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(s => <Star key={s} size={10} className="text-yellow-400 fill-yellow-400" />)}
                </div>
              </div>
            ))}
          </div>
          <div className="bg-black rounded-2xl p-5 flex flex-col items-center justify-center gap-3">
            <p className="text-white font-semibold">Your Expert Rating</p>
            <p className="text-5xl font-bold text-white">4.9</p>
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(s => <Star key={s} size={18} className="text-yellow-400 fill-yellow-400" />)}
            </div>
            <p className="text-gray-400 text-xs">Based on 342 reviews</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
