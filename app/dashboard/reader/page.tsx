"use client";
import { useEffect, useState } from "react";
import { useUser } from "@/components/UserContext";
import AppLayout from "@/components/AppLayout";
import { TrendingUp, TrendingDown } from "lucide-react";
import { listSavedArticles, type SavedArticleRow } from "@/lib/supabase/reading";

const STREAK_DAYS = ["M","T","W","T","F","S","S"];

export default function ReaderDashboard() {
  const { userName } = useUser();
  const [saved, setSaved] = useState<SavedArticleRow[]>([]);

  useEffect(() => {
    let alive = true;
    listSavedArticles()
      .then(rows => {
        if (alive) setSaved(rows);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const completed = saved.filter(article => article.progress === 100).length;
  const inProgress = saved.filter(article => article.progress > 0 && article.progress < 100).length;
  const averageProgress = saved.length
    ? Math.round(saved.reduce((sum, article) => sum + article.progress, 0) / saved.length)
    : 0;
  const topArticles = saved.slice(0, 3).map((article, index) => ({
    rank: index + 1,
    name: article.title,
    views: `${article.progress}% read`,
  }));
  const streakRead = STREAK_DAYS.map((_, index) => index < Math.min(completed, STREAK_DAYS.length));

  return (
    <AppLayout bg="bg-[#F4F4F4]">
      <div className="p-6 min-h-screen">

        {/* Header — date/filter/search removed per plan */}
        <div className="mb-5">
          <p className="text-xs text-gray-400 mb-0.5">Dashboard</p>
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {userName}</h1>
          <p className="text-sm text-gray-500">Your Dashboard Preview</p>
        </div>

        {/* Row 1 — Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5 mb-4">
          {[
            { label:"Articles Saved", value:String(saved.length), icon:"📘", change:"Reading list", up:true },
            { label:"Finished", value:String(completed), icon:"💬", change:`${inProgress} in progress`, up:false },
            { label:"Reading Streak", value:`${completed} days`, icon:"🔥", change:"Based on completions", up:true },
          ].map(({ label, value, icon, change, up }) => (
            <div key={label} className="bg-[#1A1A1A] rounded-2xl p-5 text-white flex items-center gap-4">
              <div className="text-3xl">{icon}</div>
              <div>
                <p className="text-xs text-gray-400 mb-1">{label}</p>
                <p className="text-2xl font-bold">{value}</p>
                <p className={`text-xs mt-1 flex items-center gap-1 ${up?"text-green-400":"text-red-400"}`}>
                  {up ? <TrendingUp size={11}/> : <TrendingDown size={11}/>} {change}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Row 2 — Top Articles + Understanding Meter */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
          <div className="md:col-span-2 bg-white rounded-2xl p-5 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <p className="font-semibold text-gray-900 text-sm">Your Top Articles</p>
              <button className="text-xs text-gray-400 hover:text-gray-700 cursor-pointer">Details</button>
            </div>
            {topArticles.map(a => (
              <div key={a.rank} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-gray-500">#{a.rank}</span>
                  <span className="text-sm text-gray-800">{a.name}</span>
                </div>
                <p className="text-xs text-gray-400">{a.views}</p>
              </div>
            ))}
            {topArticles.length === 0 && (
              <p className="text-sm text-gray-400 py-8 text-center">Saved articles will appear here.</p>
            )}
          </div>

          {/* Understanding Meter */}
          <div className="md:col-span-3 bg-[#1A1A1A] rounded-2xl p-5">
            <p className="text-white text-sm font-semibold mb-4">Understanding Meter</p>
            <div className="flex items-center gap-6">
              <div className="relative w-36 h-36 flex-shrink-0">
                <svg viewBox="0 0 120 120" className="w-full h-full">
                  <circle cx="60" cy="60" r="48" fill="none" stroke="#2a2a2a" strokeWidth="12"/>
                  <circle cx="60" cy="60" r="48" fill="none" stroke="#ffffff" strokeWidth="12"
                    strokeDasharray="180 302" strokeLinecap="round" transform="rotate(-90 60 60)"/>
                  <text x="60" y="55" textAnchor="middle" fill="white" fontSize="18" fontWeight="700">{averageProgress}%</text>
                  <text x="60" y="70" textAnchor="middle" fill="#9ca3af" fontSize="8">Comprehension</text>
                </svg>
              </div>
              <div>
                <p className="text-white text-5xl font-bold mb-1">{averageProgress}%</p>
                <p className="text-gray-400 text-xs leading-relaxed mb-3">
                  Your comprehension score across all reviewed articles this month.
                </p>
                <p className="text-gray-400 text-xs">❓ How is this calculated?</p>
                <p className="text-gray-500 text-xs mt-1 leading-relaxed">Based on accuracy ratings you receive on your submitted opinions.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Row 3 — Genre Breakdown + Reading Streak */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
          {/* Genre Breakdown */}
          <div className="md:col-span-2 bg-white rounded-2xl p-5 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <p className="font-semibold text-gray-900 text-sm">Genre Breakdown</p>
              <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-lg">This Month</span>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex flex-col gap-3 flex-1">
                {[
                  { label:"Finished", pct:completed ? Math.round((completed / Math.max(saved.length, 1)) * 100) : 0, color:"#111" },
                  { label:"In Progress", pct:inProgress ? Math.round((inProgress / Math.max(saved.length, 1)) * 100) : 0, color:"#555" },
                  { label:"Unread", pct:Math.max(0, 100 - Math.round(((completed + inProgress) / Math.max(saved.length, 1)) * 100)), color:"#999" },
                ].map(({ label, pct, color }) => (
                  <div key={label}>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1 gap-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ background: color }}/>
                        <span className="text-xs text-gray-600">{label}</span>
                      </div>
                      <span className="text-xs text-gray-400">{pct}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div className="h-1.5 rounded-full" style={{ width:`${pct}%`, background: color }}/>
                    </div>
                  </div>
                ))}
              </div>
              <div className="relative w-20 h-20 flex-shrink-0">
                <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
                  <circle cx="40" cy="40" r="28" fill="none" stroke="#f3f4f6" strokeWidth="14"/>
                  <circle cx="40" cy="40" r="28" fill="none" stroke="#111" strokeWidth="14" strokeDasharray="73 103"/>
                  <circle cx="40" cy="40" r="28" fill="none" stroke="#555" strokeWidth="14" strokeDasharray="54 122" strokeDashoffset="-73"/>
                  <circle cx="40" cy="40" r="28" fill="none" stroke="#999" strokeWidth="14" strokeDasharray="47 129" strokeDashoffset="-127"/>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-700">{saved.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Reading Streak */}
          <div className="md:col-span-3 bg-white rounded-2xl p-5 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <p className="font-semibold text-gray-900 text-sm">🔥 Reading Streak</p>
              <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-lg">This Week</span>
            </div>
            <div className="flex items-end gap-3 mb-5">
              <p className="text-5xl font-bold text-gray-900">5</p>
              <div className="mb-1">
                <p className="text-sm font-semibold text-gray-700">day streak</p>
                <p className="text-xs text-gray-400">Keep it going!</p>
              </div>
            </div>
            <div className="flex gap-2 mb-5">
              {STREAK_DAYS.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                  <div className={`w-full h-8 rounded-lg ${streakRead[i] ? "bg-[#111]" : "bg-gray-100"}`}/>
                  <span className="text-xs text-gray-400">{d}</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-gray-100 pt-4">
              {[
                { label:"Articles Saved", value:String(saved.length) },
                { label:"Avg. Progress",  value:`${averageProgress}%` },
                { label:"Finished",      value:String(completed) },
              ].map(({ label, value }) => (
                <div key={label} className="text-center">
                  <p className="text-xl font-bold text-gray-900">{value}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
