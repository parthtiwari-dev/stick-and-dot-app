"use client";
import AppLayout from "@/components/AppLayout";
import Link from "next/link";
import { Search, Edit2 } from "lucide-react";

const ACTIVE_ORDERS = [
  { topic: "AI in Healthcare",      writer: "Arthur Black",  status: "In Progress",    budget: "₹4,500" },
  { topic: "Sustainable Fashion",   writer: "Shaivya Saini", status: "Pending Review", budget: "₹3,200" },
  { topic: "Crypto Market Analysis",writer: "Jerome Bell",   status: "Completed",      budget: "₹6,000" },
];

const STATCLS: Record<string, string> = {
  "In Progress":    "bg-blue-50 text-blue-600",
  "Pending Review": "bg-yellow-50 text-yellow-600",
  "Completed":      "bg-green-50 text-green-600",
};

export default function BusinessProfile() {
  return (
    <AppLayout bg="bg-[#F4F4F4]">
      <div className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">
              <Link href="/dashboard/business" className="hover:text-gray-700">Dashboard</Link>&gt;Profile
            </p>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Company Profile</h1>
          </div>
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-400 w-44">
            <Search size={13} /><span>Search</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-5">
          {/* Profile card */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 w-full lg:w-[280px] flex-shrink-0">
            <div className="flex flex-col items-center mb-5">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-4xl mb-3">🏢</div>
              <p className="text-gray-900 font-semibold text-base">Tokopedia Inc.</p>
              <p className="text-gray-500 text-xs mb-1">Technology Company</p>
              <p className="text-gray-400 text-xs">CLT-001</p>
            </div>

            <div className="flex justify-around mb-5 py-4 border-y border-gray-100">
              {[{ label:"Orders", val:"14" }, { label:"Writers", val:"9" }, { label:"Spent", val:"₹54K" }].map(s => (
                <div key={s.label} className="text-center">
                  <p className="text-gray-900 font-bold text-base">{s.val}</p>
                  <p className="text-gray-400 text-xs">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="space-y-2 mb-5">
              <div><p className="text-xs text-gray-400 mb-0.5">Industry</p><p className="text-sm text-gray-700">E-Commerce / Technology</p></div>
              <div><p className="text-xs text-gray-400 mb-0.5">Location</p><p className="text-sm text-gray-700">Jakarta, Indonesia</p></div>
              <div><p className="text-xs text-gray-400 mb-0.5">Member since</p><p className="text-sm text-gray-700">June 2022</p></div>
            </div>

            <p className="text-xs text-gray-400 mb-1 font-medium">About</p>
            <p className="text-xs text-gray-500 leading-relaxed mb-5">
              Leading e-commerce platform in Southeast Asia. We commission expert content to educate our merchant and buyer communities.
            </p>

            <Link href="/dashboard/business/settings">
              <button className="w-full py-3 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold cursor-pointer hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                <Edit2 size={14} />Edit Profile
              </button>
            </Link>
          </div>

          {/* Active commissions */}
          <div className="flex-1 bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-5">
              <p className="text-gray-900 font-semibold">Active Commissions</p>
              <Link href="/dashboard/business/writers" className="text-xs text-gray-400 hover:text-gray-700">View All</Link>
            </div>
            <div className="flex flex-col gap-4">
              {ACTIVE_ORDERS.map((o, i) => (
                <div key={i} className="flex items-start justify-between py-4 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-800 mb-1">{o.topic}</p>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-orange-300 to-orange-600 flex items-center justify-center text-white text-xs font-bold">{o.writer[0]}</div>
                      <p className="text-xs text-gray-400">{o.writer}</p>
                    </div>
                  </div>
                  <div className="text-right ml-4 flex-shrink-0">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full block mb-1 ${STATCLS[o.status]}`}>{o.status}</span>
                    <p className="text-xs font-semibold text-gray-700">{o.budget}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5">
              <Link href="/dashboard/business/commission">
                <button className="w-full py-3 rounded-xl bg-[#111] text-white text-sm font-semibold hover:bg-[#333] transition-colors cursor-pointer">
                  + New Commission
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
