"use client";
import AppLayout from "@/components/AppLayout";
import Footer from "@/components/Footer";
import { Search, TrendingUp, TrendingDown } from "lucide-react";

const CALENDAR_DAYS = [
  ["25","26","27","28","29","30","1"],
  ["2","3","4","5","6","7","8"],
  ["9","10","11","12","13","14","15"],
  ["16","17","18","19","20","21","22"],
  ["23","24","25","26","27","28","29"],
  ["30","31","1","2","3","4","5"],
];

export default function BusinessDashboard() {
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

        {/* Top Row: Profile Card + Stat Cards */}
        <div className="grid grid-cols-3 gap-4 mt-5 mb-4">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 row-span-2">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-2xl flex-shrink-0">👤</div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-sm">Jerome Bell</p>
                <p className="text-xs text-gray-400">Marketing Coordinator</p>
              </div>
              <button className="text-xs border border-gray-200 px-3 py-1.5 rounded-lg text-gray-600 cursor-pointer hover:bg-gray-50">Quick Profile</button>
            </div>
            <div className="space-y-1.5 mb-4">
              {[["Phone","+6081325132288"],["Email","richa@gmail.com"],["Address","Merdeka Street, Wonosobo"]].map(([l,v]) => (
                <div key={l} className="flex gap-2">
                  <span className="text-gray-400 text-xs w-16 flex-shrink-0">{l}</span>
                  <span className="text-gray-700 text-xs">{v}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 leading-relaxed mb-4">
              I&apos;m the CEO at Tokopedia. Establishing an application myself to my goal. I want to help...
            </p>
            <button className="w-full py-2.5 rounded-xl bg-[#F97316] text-white text-sm font-semibold cursor-pointer hover:bg-[#ea6c0a] transition-colors">
              Go to Details
            </button>
          </div>

          {/* Stat Cards */}
          <div className="bg-[#1A1A1A] rounded-2xl p-5 text-white flex items-center gap-3">
            <div className="text-3xl">🪙</div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Payments</p>
              <p className="text-2xl font-bold">Rs. XYZ</p>
              <p className="text-green-400 text-xs flex items-center gap-1"><TrendingUp size={11} /> +39.89%</p>
            </div>
          </div>
          <div className="bg-[#1A1A1A] rounded-2xl p-5 text-white flex items-center gap-3">
            <div className="text-3xl">📘</div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Words</p>
              <p className="text-2xl font-bold">XXX</p>
              <p className="text-red-400 text-xs flex items-center gap-1"><TrendingDown size={11} /> -5.23%</p>
            </div>
          </div>
          <div className="bg-[#1A1A1A] rounded-2xl p-5 text-white flex items-center gap-3">
            <div className="text-3xl">🧩</div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Engagement</p>
              <p className="text-2xl font-bold">50%</p>
              <p className="text-green-400 text-xs flex items-center gap-1"><TrendingUp size={11} /> +39.69%</p>
            </div>
          </div>
          <div className="bg-[#1A1A1A] rounded-2xl p-5 text-white flex items-center gap-3">
            <div className="text-3xl">📊</div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Words</p>
              <p className="text-2xl font-bold">XXX</p>
              <p className="text-red-400 text-xs flex items-center gap-1"><TrendingDown size={11} /> -5.23%</p>
            </div>
          </div>
        </div>

        {/* Task Stats + Sales Overview */}
        <div className="grid grid-cols-5 gap-4 mb-4">
          {/* Task Statistic */}
          <div className="col-span-2 bg-white rounded-2xl p-5 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <p className="font-semibold text-gray-900 text-sm">Task Statistic</p>
              <span className="text-red-400 text-xs flex items-center gap-1"><TrendingDown size={11} /> -3.00%</span>
            </div>
            <div className="flex justify-between mb-4">
              <div className="text-center">
                <p className="text-xs text-gray-400">Total Task</p>
                <p className="text-2xl font-bold text-gray-900">476</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400">Overdue Tasks</p>
                <p className="text-2xl font-bold text-red-500">23</p>
              </div>
            </div>
            <div className="flex items-center justify-center mb-4">
              <div className="relative w-32 h-32">
                <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                  <circle cx="60" cy="60" r="45" fill="none" stroke="#f3f4f6" strokeWidth="14" />
                  <circle cx="60" cy="60" r="45" fill="none" stroke="#111" strokeWidth="14"
                    strokeDasharray="178 283" strokeLinecap="round" />
                  <circle cx="60" cy="60" r="45" fill="none" stroke="#888" strokeWidth="14"
                    strokeDasharray="53 283" strokeDashoffset="-178" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-xs text-gray-400">Complete Task</p>
                  <p className="text-sm font-bold text-gray-900">186 Task</p>
                </div>
              </div>
            </div>
            {[["Complete Task","186"],["Inprogress Task","47"],["Pending Task","54"]].map(([l,v],idx) => (
              <div key={idx} className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gray-800" />
                  <span className="text-xs text-gray-600">{l}</span>
                </div>
                <span className="text-xs font-semibold text-gray-800">{v}</span>
              </div>
            ))}
          </div>

          {/* Sales Overview */}
          <div className="col-span-3 bg-white rounded-2xl p-5 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-green-500 text-xs flex items-center gap-1"><TrendingUp size={11} /> +4034%</span>
                <p className="font-semibold text-gray-900 text-sm">Sales Overview</p>
              </div>
              <select className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 outline-none text-gray-600 bg-white cursor-pointer">
                <option>month</option>
                <option>week</option>
              </select>
            </div>
            <div className="h-44">
              <svg viewBox="0 0 400 160" className="w-full h-full">
                <defs>
                  <linearGradient id="salesGrad1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#111" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#111" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="salesGrad2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#999" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#999" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[20,40,60,80,100].map(y => (
                  <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="#f3f4f6" strokeWidth="1" />
                ))}
                <path d="M0,120 C60,110 80,80 120,70 C160,60 180,90 220,60 C260,30 300,50 340,40 C370,33 390,38 400,35" stroke="#111" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <path d="M0,120 C60,110 80,80 120,70 C160,60 180,90 220,60 C260,30 300,50 340,40 C370,33 390,38 400,35 L400,160 L0,160 Z" fill="url(#salesGrad1)" />
                <path d="M0,100 C60,105 80,90 120,95 C160,100 180,70 220,80 C260,90 300,75 340,70 C370,66 390,72 400,70" stroke="#bbb" strokeWidth="2" fill="none" strokeDasharray="5,3" />
                {["Jan","Feb","Mar","Apr","May","Jun"].map((m,i) => (
                  <text key={m} x={i*66+20} y="155" fill="#9ca3af" fontSize="9">{m}</text>
                ))}
                <text x="5" y="15" fill="#6b7280" fontSize="9">100</text>
                <text x="5" y="55" fill="#6b7280" fontSize="9">60</text>
                <text x="5" y="95" fill="#6b7280" fontSize="9">20</text>
              </svg>
            </div>
            <div className="flex gap-4 mt-1">
              <span className="text-xs text-gray-500 flex items-center gap-1"><span className="w-3 h-0.5 bg-gray-800 inline-block" /> Total Sales</span>
              <span className="text-xs text-gray-400 flex items-center gap-1"><span className="w-3 h-0.5 bg-gray-400 inline-block border-dashed" /> Total Revenue</span>
            </div>
          </div>
        </div>

        {/* Mini Stats + Calendar + Total Revenue */}
        <div className="grid grid-cols-5 gap-4 mb-4">
          {/* Mini Stats */}
          <div className="col-span-2 grid grid-cols-2 gap-3">
            {[
              { id:1, label:"Projects", value:"4,732", change:"+100%", up:true, icon:"📁" },
              { id:2, label:"Clients",  value:"1,627", change:"-4.8%",  up:false, icon:"👥" },
              { id:3, label:"Tasks",    value:"3,275", change:"-5%",    up:false, icon:"✅" },
              { id:4, label:"Employees",value:"6,187", change:"+100%", up:true, icon:"⭐" },
            ].map(({ label, value, change, up, icon }) => (
              <div key={label} className="bg-white rounded-2xl p-4 border border-gray-100">
                <p className="text-xl mb-1">{icon}</p>
                <p className="text-xs text-gray-400">{label}</p>
                <p className="text-lg font-bold text-gray-900">{value}</p>
                <p className={`text-xs flex items-center gap-1 ${up ? "text-green-500" : "text-red-500"}`}>
                  {up ? <TrendingUp size={10} /> : <TrendingDown size={10} />} {change}
                </p>
              </div>
            ))}
          </div>

          {/* Calendar */}
          <div className="col-span-1 bg-white rounded-2xl p-4 border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <p className="font-semibold text-gray-900 text-sm">📅 Calendar</p>
              <span className="text-xs text-gray-400">October</span>
            </div>
            <div className="grid grid-cols-7 gap-0">
              {["Mo","Tu","We","Th","Fr","Sa","Su"].map(d => (
                <div key={d} className="text-center text-[9px] text-gray-400 font-medium py-0.5">{d}</div>
              ))}
              {CALENDAR_DAYS.flat().map((d, i) => (
                <div key={i}
                  className={`text-center text-[10px] py-1 rounded cursor-pointer ${
                    d === "13" ? "bg-[#111] text-white font-bold" :
                    ["20","27","29"].includes(d) ? "text-[#F97316] font-semibold" :
                    d === "" ? "" : "text-gray-700 hover:bg-gray-50"
                  }`}>{d}</div>
              ))}
            </div>
          </div>

          {/* Total Revenue */}
          <div className="col-span-2 bg-white rounded-2xl p-5 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <p className="font-semibold text-gray-900 text-sm">Total Revenue</p>
              <select className="text-xs border border-gray-200 rounded-lg px-2 py-1 outline-none text-gray-600 bg-white cursor-pointer">
                <option>2022</option>
                <option>2023</option>
              </select>
            </div>
            <div className="h-32">
              <svg viewBox="0 0 300 120" className="w-full h-full">
                {[30,60,90].map(y => (
                  <line key={y} x1="20" y1={y} x2="300" y2={y} stroke="#f3f4f6" strokeWidth="1" />
                ))}
                {[0,1,2,3,4,5].map((i) => {
                  const heights = [60,85,45,100,70,55];
                  const x = 30 + i * 44;
                  const h = heights[i];
                  return (
                    <g key={i}>
                      <rect x={x} y={120-h} width="16" height={h} fill="#111" rx="3" />
                      <rect x={x+18} y={120-h*0.6} width="16" height={h*0.6} fill="#d1d5db" rx="3" />
                    </g>
                  );
                })}
                {["Jan","Feb","Mar","Apr","May","Jun"].map((m,i) => (
                  <text key={m} x={30+i*44+8} y="118" fill="#9ca3af" fontSize="7" textAnchor="middle">{m}</text>
                ))}
              </svg>
            </div>
            <div className="flex gap-4 mt-1">
              <span className="text-xs text-gray-500 flex items-center gap-1"><span className="w-3 h-2 bg-gray-800 inline-block rounded-sm" /> Total Income</span>
              <span className="text-xs text-gray-400 flex items-center gap-1"><span className="w-3 h-2 bg-gray-300 inline-block rounded-sm" /> Total Outcome</span>
            </div>
          </div>
        </div>

        {/* Help Widget */}
        <div className="bg-[#F97316] rounded-2xl p-4 flex items-center gap-4 max-w-xs">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white text-xl">💬</div>
          <div>
            <p className="text-white text-sm font-semibold">Need help?</p>
            <p className="text-orange-100 text-xs">Please check our docs</p>
          </div>
          <button className="ml-auto bg-white text-orange-600 text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer hover:bg-orange-50 transition-colors">
            DOCUMENTATION
          </button>
        </div>
      </div>
      <Footer />
    </AppLayout>
  );
}
