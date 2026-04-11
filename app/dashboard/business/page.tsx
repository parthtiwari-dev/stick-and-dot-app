"use client";
import AppLayout from "@/components/AppLayout";
import Link from "next/link";
import { Search, SlidersHorizontal, TrendingUp, TrendingDown, Edit } from "lucide-react";

function StatCard({ icon, label, value, change, up }: { icon: string; label: string; value: string; change: string; up: boolean }) {
  return (
    <div className="bg-[#1A1A1A] rounded-2xl p-4 flex-1">
      <div className="flex items-start justify-between mb-2">
        <p className="text-gray-400 text-xs">{label}</p>
        <span className="text-xl">{icon}</span>
      </div>
      <p className="text-white text-xl font-bold mb-1">{value}</p>
      <span className={`text-xs flex items-center gap-1 ${up?"text-green-400":"text-red-400"}`}>
        {up ? <TrendingUp size={11}/> : <TrendingDown size={11}/>} {change}
      </span>
    </div>
  );
}

const WRITERS = [
  { name: "Daffa Naufal", role: "Ceo at Google",    email: "daffanaufal@gmail.com",  phone: "+621234S678", id: "GGL-001" },
  { name: "Shakir Ramd", role: "Ceo at Garena",     email: "shakirrama@gmail.com",   phone: "+622346789O", id: "GRN-002" },
  { name: "Zara Annisa", role: "Ceo at Ruangkupak", email: "annisazara@gmail.com",   phone: "+623456789O", id: "BRL-003" },
  { name: "Chris Evans", role: "Ceo at Amazon",     email: "chrisevans@gmail.com",   phone: "+624567890I", id: "AMZ-004" },
  { name: "Jack Miller", role: "Ceo at Deta",       email: "jackmiller@gmail.com",   phone: "+625678901 2", id: "DAN-005" },
  { name: "Richard Kyle", role: "Ceo at Bit",       email: "richardkyle@gmail.com",  phone: "+626789012 3", id: "BIT-006" },
  { name: "John Wich",   role: "Ship Designer",     email: "johnwich@gmail.com",     phone: "+627890123", id: "SHP-007" },
  { name: "Brian Dawn",  role: "Ceo at Leeds",      email: "briandawn@gmail.com",    phone: "+628901234 5", id: "LZB-008" },
  { name: "James Wayn",  role: "Ceo at Oqie",       email: "jameswayn@gmail.com",    phone: "+629012345 6", id: "QJK-009" },
];

export default function BusinessDashboard() {
  return (
    <AppLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Dashboard&gt;Profile</p>
            <h1 className="text-2xl font-bold text-gray-900">Welcome, Shaivya</h1>
            <p className="text-sm text-gray-400">Your Dashboard Preview</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-400 w-44">
              <Search size={13}/><span>Search</span>
            </div>
            <button className="bg-[#111] text-white text-xs font-semibold px-4 py-2 rounded-full cursor-pointer">Today</button>
            <button className="bg-white text-gray-600 text-xs px-4 py-2 rounded-full border border-gray-200 cursor-pointer">Select Date</button>
            <button className="bg-white text-gray-600 text-xs px-4 py-2 rounded-full border border-gray-200 flex items-center gap-1 cursor-pointer">
              <SlidersHorizontal size={11}/>Filter
            </button>
          </div>
        </div>

        <div className="flex gap-5">
          {/* Left column — profile + task stats */}
          <div className="flex flex-col gap-4" style={{minWidth:260}}>
            {/* Profile Card */}
            <div className="bg-[#1A1A1A] rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-xl">👤</div>
                <div>
                  <p className="text-white font-semibold text-sm">Jerome Bell</p>
                  <p className="text-gray-400 text-xs">Marketing Consultant</p>
                </div>
                <button className="ml-auto bg-[#2a2a2a] text-gray-300 text-xs px-3 py-1 rounded-lg cursor-pointer hover:bg-[#333]">Edit</button>
              </div>
              <div className="flex flex-col gap-2 text-xs">
                <div><span className="text-gray-500">Email</span><p className="text-gray-300 mt-0.5">jerome@example.com</p></div>
                <div><span className="text-gray-500">Phone</span><p className="text-gray-300 mt-0.5">+1 234 567 8900</p></div>
                <div><span className="text-gray-500">Description</span><p className="text-gray-400 mt-0.5 leading-relaxed">An active Tokopedia data kelebihan application myself to my goal, I want to help.</p></div>
              </div>
              <Link href="/dashboard/business/settings">
                <button className="w-full mt-4 py-2.5 rounded-xl bg-[#F97316] text-white text-sm font-semibold hover:bg-[#ea6c0a] transition-colors cursor-pointer">Edit Details</button>
              </Link>
            </div>

            {/* Task Statistics */}
            <div className="bg-[#1A1A1A] rounded-2xl p-5">
              <p className="text-white text-sm font-semibold mb-4">Task Statistics</p>
              <div className="flex gap-4 mb-4">
                <div><p className="text-gray-400 text-xs">Total Tasks</p><p className="text-white font-bold text-lg">476</p></div>
                <div><p className="text-gray-400 text-xs">Overdue Tasks</p><p className="text-white font-bold text-lg">23</p></div>
              </div>
              <div className="flex justify-center mb-4">
                <svg width="120" height="120" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#333" strokeWidth="16"/>
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#e5e5e5" strokeWidth="16" strokeDasharray="199 115" strokeDashoffset="79" strokeLinecap="round"/>
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#888" strokeWidth="16" strokeDasharray="55 259" strokeDashoffset="-120" strokeLinecap="round"/>
                  <text x="60" y="55" textAnchor="middle" fill="#888" fontSize="8">Complete</text>
                  <text x="60" y="70" textAnchor="middle" fill="white" fontSize="14" fontWeight="700">186</text>
                </svg>
              </div>
              {[["Complete Task","186","#e5e5e5"],["In-progress Task","47","#888"],["Pending Task","14","#555"]].map(([l,v,c]) => (
                <div key={l} className="flex items-center gap-2 mb-1.5">
                  <div className="w-2 h-2 rounded-full" style={{background:c}}/>
                  <span className="text-gray-400 text-xs flex-1">{l}</span>
                  <span className="text-gray-300 text-xs font-medium">{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right column — stat cards + chart + writers table */}
          <div className="flex-1 flex flex-col gap-4">
            {/* 4 stat cards */}
            <div className="flex gap-3">
              <StatCard icon="🪙" label="Payments done" value="Rs. XYZ" change="+9.05%" up={true}/>
              <StatCard icon="⌨️" label="Words written" value="XXX" change="+4.22%" up={true}/>
              <StatCard icon="🧩" label="Engagement to be" value="50%" change="-2.18%" up={false}/>
              <StatCard icon="📋" label="Words pending" value="XXX" change="+1.4%" up={true}/>
            </div>

            {/* Performance chart */}
            <div className="bg-[#1A1A1A] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-white text-sm font-semibold">Garner Performance Overview</p>
                <select className="bg-[#2a2a2a] text-gray-300 text-xs rounded-lg px-3 py-1.5 border-none outline-none cursor-pointer">
                  <option>Monthly</option><option>Weekly</option>
                </select>
              </div>
              <svg width="100%" height="110" viewBox="0 0 400 110" preserveAspectRatio="none">
                <path d="M0,80 C50,70 100,40 150,50 C200,60 250,30 300,35 C350,40 380,25 400,20" stroke="white" strokeWidth="1.5" fill="none"/>
                <path d="M0,90 C50,85 100,65 150,70 C200,75 250,55 300,60 C350,65 380,50 400,45" stroke="#888" strokeWidth="1.5" fill="none" strokeDasharray="4 2"/>
              </svg>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                {["Jan","Feb","Mar","Apr","May","Jun"].map(m=><span key={m}>{m}</span>)}
              </div>
              <div className="flex gap-4 mt-3">
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-white"/><span className="text-gray-400 text-xs">Total Users</span></div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#888]"/><span className="text-gray-400 text-xs">Total Revenue</span></div>
              </div>
            </div>

            {/* Writers table */}
            <div className="bg-white rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-900 text-sm font-semibold">Our writers</p>
                <div className="flex gap-2">
                  <select className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 outline-none text-gray-600 cursor-pointer"><option>All Data</option></select>
                  <select className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 outline-none text-gray-600 cursor-pointer"><option>August</option></select>
                </div>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="text-left">
                    <th className="text-xs text-gray-400 font-medium pb-3">Name</th>
                    <th className="text-xs text-gray-400 font-medium pb-3">Email</th>
                    <th className="text-xs text-gray-400 font-medium pb-3">Phone Number</th>
                    <th className="text-xs text-gray-400 font-medium pb-3">Employee ID</th>
                  </tr>
                </thead>
                <tbody>
                  {WRITERS.map(w => (
                    <tr key={w.id} className="border-t border-gray-50">
                      <td className="py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-300 to-orange-500 flex items-center justify-center text-white text-xs font-bold">{w.name[0]}</div>
                          <div><p className="text-sm text-gray-800 font-medium">{w.name}</p><p className="text-xs text-gray-400">{w.role}</p></div>
                        </div>
                      </td>
                      <td className="py-2.5 text-xs text-gray-500">{w.email}</td>
                      <td className="py-2.5 text-xs text-gray-500">{w.phone}</td>
                      <td className="py-2.5 text-xs text-gray-500">{w.id}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-400">Showing 9 out of 18 entries</p>
                <div className="flex gap-1">
                  <button className="text-xs text-gray-400 px-3 py-1 rounded-lg hover:bg-gray-100 cursor-pointer">Previous</button>
                  <button className="text-xs bg-[#111] text-white px-3 py-1 rounded-lg cursor-pointer">1</button>
                  <button className="text-xs text-gray-400 px-3 py-1 rounded-lg hover:bg-gray-100 cursor-pointer">2</button>
                  <button className="text-xs text-gray-400 px-3 py-1 rounded-lg hover:bg-gray-100 cursor-pointer">Next</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating help widget */}
        <div className="fixed bottom-6 left-[216px] bg-[#1A1A1A] rounded-2xl p-4 shadow-xl w-52 z-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">🤖</div>
            <div><p className="text-white text-xs font-semibold">Need Help?</p><p className="text-gray-400 text-xs">Reach out to our guide</p></div>
          </div>
          <button className="w-full py-1.5 bg-[#F97316] text-white text-xs font-semibold rounded-lg cursor-pointer">Go</button>
        </div>
      </div>
    </AppLayout>
  );
}
