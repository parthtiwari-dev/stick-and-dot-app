"use client";
import AppLayout from "@/components/AppLayout";
import Footer from "@/components/Footer";
import { Search, Star, TrendingUp, TrendingDown } from "lucide-react";

function Stars({ n }: { n: number }) {
  return (
    <span className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={11} fill={i<=n?"#F97316":"none"} className={i<=n?"text-[#F97316]":"text-gray-300"}/>
      ))}
    </span>
  );
}

const FEEDBACK_ROWS = [
  { name:"Shaivya S.", date:"10/2/2023", quality:5, feedback:"Lorem ipsum dolor Lorem ipsum dolor", article:"Article Name" },
  { name:"Shaivya S.", date:"10/2/2023", quality:4, feedback:"Lorem ipsum dolor Lorem ipsum dolor", article:"Article Name" },
  { name:"Shaivya S.", date:"10/2/2023", quality:5, feedback:"Lorem ipsum dolor Lorem ipsum dolor", article:"Article Name" },
  { name:"Shaivya S.", date:"10/2/2023", quality:4, feedback:"Lorem ipsum dolor Lorem ipsum dolor", article:"Article Name" },
  { name:"Shaivya S.", date:"10/2/2023", quality:5, feedback:"Lorem ipsum dolor Lorem ipsum dolor", article:"Article Name" },
  { name:"Shaivya S.", date:"10/2/2023", quality:4, feedback:"Lorem ipsum dolor Lorem ipsum dolor", article:"Article Name" },
  { name:"Shaivya S.", date:"10/2/2023", quality:5, feedback:"Lorem ipsum dolor Lorem ipsum dolor", article:"Article Name" },
  { name:"Shaivya S.", date:"10/2/2023", quality:4, feedback:"Lorem ipsum dolor Lorem ipsum dolor", article:"Article Name" },
];

const TOP_ARTICLES = [
  { rank:1, name:"Article Name", rating:5, views:"12K Views" },
  { rank:2, name:"Article Name", rating:4, views:"12K Views" },
  { rank:3, name:"Article Name", rating:4, views:"12K Views" },
];

const CATEGORIES = [
  { id:1, name:"Category Name", popularity:"10.1K", icon:"🔖" },
  { id:2, name:"Category Name", popularity:"10.1K", icon:"💡" },
  { id:3, name:"Category Name", popularity:"10.1K", icon:"📋" },
];

const AUDIENCE_ITEMS = [
  { id:1, label:"Lorem Ipsum" },
  { id:2, label:"Lorem Ipsum" },
  { id:3, label:"Lorem Ipsum" },
  { id:4, label:"Lorem Ipsum" },
];

const PERF_ITEMS = [
  { id:1, label:"Impressions", value:"12k" },
  { id:2, label:"Likes",       value:"12k" },
  { id:3, label:"Feedbacks",   value:"12k" },
];

export default function WriterDashboard() {
  return (
    <AppLayout bg="bg-[#F4F4F4]">
      <div className="p-4 md:p-6 min-h-screen">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-5">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Dashboard&gt;Profile</p>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Welcome, Shaivya</h1>
            <p className="text-sm text-gray-500">Your Dashboard Preview</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button className="bg-[#111] text-white text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer">Today</button>
            <button className="bg-white border border-gray-200 text-gray-600 text-xs px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-50">Select Date</button>
            <button className="bg-white border border-gray-200 text-gray-600 text-xs px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-50">▼ Filter</button>
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-400 w-36">
              <Search size={13}/><span>Search</span>
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          {[
            { label:"Payments",   value:"Rs. XYZ", icon:"🪙", change:"+39.89%", up:true  },
            { label:"Words",      value:"XXX",     icon:"📘", change:"-5.23%",  up:false },
            { label:"Engagement", value:"50%",     icon:"🧩", change:"+39.69%", up:true  },
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

        {/* Feedback Banner */}
        <div className="bg-[#1A1A1A] rounded-2xl p-5 mb-4 flex flex-wrap items-center gap-4">
          <div className="text-3xl">💰</div>
          <div>
            <p className="text-3xl font-bold text-white">12k</p>
            <p className="text-xs text-gray-400">Feedbacks</p>
          </div>
          <div className="flex gap-0.5 ml-2">
            {[1,2,3,4,5].map(i => <Star key={i} size={18} fill="#F97316" className="text-[#F97316]"/>)}
          </div>
          <div className="ml-auto flex items-center gap-3 bg-[#2A2A2A] rounded-xl px-4 py-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex-shrink-0"/>
            <div>
              <p className="text-white text-sm font-semibold">Shaivya S.</p>
              <p className="text-gray-400 text-xs">Lorem ipsum dolor sit amet</p>
              <p className="text-gray-500 text-xs">+XXX</p>
            </div>
            <button className="text-gray-400 hover:text-white ml-2 cursor-pointer text-lg">→</button>
          </div>
        </div>

        {/* Top Articles + Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
          <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <p className="font-semibold text-gray-900 text-sm">Your Top Articles</p>
              <button className="text-xs text-gray-400 hover:text-gray-700 cursor-pointer">Details</button>
            </div>
            {TOP_ARTICLES.map(a => (
              <div key={a.rank} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-500">#{a.rank}</span>
                  <span className="text-sm text-gray-800">{a.name}</span>
                </div>
                <div className="text-right">
                  <Stars n={a.rating}/>
                  <p className="text-xs text-gray-400 mt-0.5">{a.views}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="lg:col-span-3 bg-[#1A1A1A] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <p className="text-white text-sm font-semibold">📊 Trends</p>
                <span className="text-red-400 text-xs flex items-center gap-1"><TrendingDown size={11}/>-5.23%</span>
              </div>
              <select className="bg-[#2A2A2A] text-gray-300 text-xs px-3 py-1.5 rounded-lg outline-none cursor-pointer border-0">
                <option>Payment</option><option>Words</option>
              </select>
            </div>
            <div className="relative h-40 w-full">
              <svg viewBox="0 0 400 140" className="w-full h-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.15"/>
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                <path d="M0,100 C40,100 40,80 80,75 C120,70 130,110 160,60 C190,10 220,40 260,30 C300,20 330,50 360,35 C390,20 400,25 400,25"
                  stroke="#ffffff" strokeWidth="2" fill="none"/>
                <path d="M0,100 C40,100 40,80 80,75 C120,70 130,110 160,60 C190,10 220,40 260,30 C300,20 330,50 360,35 C390,20 400,25 400,25 L400,140 L0,140 Z"
                  fill="url(#trendGrad)"/>
                {["Mon","Tue","Wed","Thurs","Fri","Sat","Sun"].map((d,i) => (
                  <text key={d} x={i*57+8} y="135" fill="#6b7280" fontSize="9">{d}</text>
                ))}
              </svg>
            </div>
          </div>
        </div>

        {/* Engagement + Top Category + Audience */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Engagement */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-gray-900">📈 Engagement</p>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">This Week</span>
            </div>
            <div className="flex gap-6 mb-3">
              <div><p className="text-xs text-gray-400">This Week</p><p className="text-green-500 font-bold text-sm">+20%</p></div>
              <div><p className="text-xs text-gray-400">Last Week</p><p className="text-red-500 font-bold text-sm">-10%</p></div>
            </div>
            <p className="text-xs text-gray-500 mb-2">Impressions</p>
            <div className="flex items-end gap-1 h-12">
              {[40,55,35,60,45,70,50].map((h,i) => (
                <div key={i} className={`flex-1 rounded-sm ${i===4?"bg-[#111]":"bg-gray-200"}`} style={{height:`${h}%`}}/>
              ))}
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-400">TOTAL</span>
              <span className="text-xs text-gray-400">+15</span>
              <span className="text-xs text-gray-400">1.2k</span>
            </div>
          </div>

          {/* Top Category - fixed unique keys */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-gray-900">📊 Top Category</p>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">This Week</span>
            </div>
            {CATEGORIES.map(c => (
              <div key={c.id} className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
                <span className="text-xl">{c.icon}</span>
                <div>
                  <p className="text-sm text-gray-800 font-medium">{c.name}</p>
                  <p className="text-xs text-gray-400">Popularity: {c.popularity}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Audience - fixed unique keys */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-gray-900">Audience</p>
              <button className="text-xs text-gray-400 hover:text-gray-700 cursor-pointer">Details</button>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex flex-col gap-2 flex-1">
                {AUDIENCE_ITEMS.map((item, i) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{background:["#111","#555","#999","#ccc"][i]}}/>
                    <span className="text-xs text-gray-500">{item.label}</span>
                  </div>
                ))}
              </div>
              <div className="relative w-24 h-24 flex-shrink-0">
                <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
                  <circle cx="40" cy="40" r="28" fill="none" stroke="#f3f4f6" strokeWidth="16"/>
                  <circle cx="40" cy="40" r="28" fill="none" stroke="#111" strokeWidth="16" strokeDasharray="52 124"/>
                  <circle cx="40" cy="40" r="28" fill="none" stroke="#555" strokeWidth="16" strokeDasharray="35 141" strokeDashoffset="-52"/>
                  <circle cx="40" cy="40" r="28" fill="none" stroke="#999" strokeWidth="16" strokeDasharray="25 151" strokeDashoffset="-87"/>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xs font-bold text-gray-800">Total</span>
                  <span className="text-sm font-bold text-gray-900">xyz</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Section */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 mb-4">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Feedback</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
            <div className="sm:col-span-2 bg-[#1A1A1A] rounded-xl p-5">
              <p className="text-white text-sm font-semibold text-center mb-3">Your Recent Performance</p>
              <div className="flex justify-around divide-x divide-gray-700">
                {PERF_ITEMS.map(item => (
                  <div key={item.id} className="text-center flex-1 px-2">
                    <p className="text-2xl font-bold text-white">{item.value}</p>
                    <p className="text-xs text-gray-400">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[#1A1A1A] rounded-xl p-5 flex flex-col items-center justify-center">
              <p className="text-white text-sm font-semibold mb-1">Overall</p>
              <p className="text-3xl font-bold text-white">4.5/5</p>
              <div className="flex gap-0.5 mt-1">
                {[1,2,3,4,5].map(i=><Star key={i} size={14} fill={i<=4?"#F97316":"none"} className={i<=4?"text-[#F97316]":"text-gray-600"}/>)}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Name","Date Created","Quality","Feedback","Article"].map(h=>(
                    <th key={h} className="text-xs text-gray-400 font-medium pb-3 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {FEEDBACK_ROWS.map((r, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">S</div>
                        <span className="text-sm text-gray-700 font-medium">{r.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-sm text-gray-500">{r.date}</td>
                    <td className="py-3"><Stars n={r.quality}/></td>
                    <td className="py-3 text-sm text-gray-500">{r.feedback}</td>
                    <td className="py-3 text-sm text-gray-500">{r.article}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
      <Footer/>
    </AppLayout>
  );
}
