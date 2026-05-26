"use client";
import { useEffect, useState } from "react";
import { useUser } from "@/components/UserContext";
import AppLayout from "@/components/AppLayout";
import { TrendingUp, TrendingDown } from "lucide-react";
import { formatMoney, listMyCommissions } from "@/lib/supabase/commissions";

type BusinessArticle = { rank:number; title:string; views:string; rating:number };

export default function BusinessDashboard() {
  const { userName } = useUser();
  const [stats, setStats] = useState({ wordsOrdered: 0, wordsPending: 0, paymentDone: 0 });
  const [topArticles, setTopArticles] = useState<BusinessArticle[]>([]);

  useEffect(() => {
    let alive = true;
    listMyCommissions()
      .then(rows => {
        if (!alive) return;
        const pending = rows.filter(row => !["delivered", "completed", "cancelled"].includes(row.status));
        setStats({
          wordsOrdered: rows.reduce((sum, row) => sum + (row.word_count ?? 0), 0),
          wordsPending: pending.reduce((sum, row) => sum + (row.word_count ?? 0), 0),
          paymentDone: rows.reduce((sum, row) => sum + (row.payment_amount ?? 0), 0),
        });
        setTopArticles(rows.slice(0, 3).map((row, index) => ({
          rank: index + 1,
          title: row.topic,
          views: row.status,
          rating: row.assigned_writer_id ? 4.8 : 0,
        })));
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  return (
    <AppLayout bg="bg-[#F4F4F4]">
      <div className="p-6 min-h-screen">

        {/* Header — date/filter/search removed per plan */}
        <div className="mb-5">
          <p className="text-xs text-gray-400 mb-0.5">Dashboard</p>
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {userName}</h1>
          <p className="text-sm text-gray-500">Your Dashboard Preview</p>
        </div>

        {/* Stat Cards — Words Ordered / Words Pending / Payment Done */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5 mb-4">
          {[
            { label:"Words Ordered", value:stats.wordsOrdered.toLocaleString("en-IN"), icon:"📋", change:"All commissions", up:true },
            { label:"Words Pending Delivery", value:stats.wordsPending.toLocaleString("en-IN"), icon:"⏳", change:"Open work", up:false },
            { label:"Payment Done", value:formatMoney(stats.paymentDone), icon:"🪙", change:"Metadata only", up:true },
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
            {topArticles.map(a => (
              <div key={a.rank} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-gray-400">#{a.rank}</span>
                  <div>
                    <p className="text-sm text-gray-800 font-medium leading-tight line-clamp-2">{a.title}</p>
                    <p className="text-xs text-gray-400">{a.views}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-xs font-semibold text-gray-700">★ {a.rating}</span>
                </div>
              </div>
            ))}
            {topArticles.length === 0 && (
              <p className="text-sm text-gray-400 py-8 text-center">Posted commissions will appear here.</p>
            )}
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
