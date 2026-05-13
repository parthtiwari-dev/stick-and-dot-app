"use client";
import AppLayout from "@/components/AppLayout";
import Link from "next/link";
import { useUser } from "@/components/UserContext";
import { TrendingUp } from "lucide-react";

const QUEUE = [
  { id:"ART-0041", title:"The Future of EVs in India",        domain:"Technology", writer:"Ravi M.",  submitted:"Apr 10", urgency:"high"   },
  { id:"ART-0042", title:"Top Finance Hacks for Gen-Z",        domain:"Finance",    writer:"Neha S.",  submitted:"Apr 10", urgency:"medium" },
  { id:"ART-0043", title:"AI in Healthcare: What Doctors Say", domain:"Medical",    writer:"Priya K.", submitted:"Apr 9",  urgency:"high"   },
  { id:"ART-0044", title:"Sustainable Fashion on a Budget",    domain:"Business",   writer:"Sara T.",  submitted:"Apr 8",  urgency:"low"    },
  { id:"ART-0045", title:"Quantum Computing Explained Simply", domain:"Science",    writer:"Aman G.",  submitted:"Apr 7",  urgency:"medium" },
];

const RECENT = [
  { id:"ART-0038", title:"Climate Policy 2025",        decision:"Approved",          score:4.2, date:"Apr 9"  },
  { id:"ART-0039", title:"Crypto Regulations in India", decision:"Revision Requested", score:2.8, date:"Apr 8"  },
  { id:"ART-0040", title:"Mental Health at Work",       decision:"Approved",          score:4.7, date:"Apr 7"  },
];

const urgencyBadge = (u: string) =>
  u === "high"   ? "bg-red-50 text-red-500 border border-red-100" :
  u === "medium" ? "bg-orange-50 text-orange-500 border border-orange-100" :
                   "bg-gray-100 text-gray-500";

export default function SubjectExpertDashboard() {
  const { userName } = useUser();
  return (
    <AppLayout bg="bg-[#F4F4F4]">
      <div className="p-4 md:p-6 min-h-screen">

        {/* Header — search removed per plan */}
        <div className="mb-5">
          <p className="text-xs text-gray-400 mb-0.5">Dashboard&gt;Expert</p>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Welcome, {userName}</h1>
          <p className="text-sm text-gray-500">Your Review Activity</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
          {[
            { label:"Reviews Done",       value:"22",      icon:"✅", change:"+18%",   up:true },
            { label:"Avg Accuracy Score", value:"4.3 / 5", icon:"🎯", change:"+0.4",   up:true },
            { label:"Payment Received",   value:"₹9,200",  icon:"🪙", change:"+22.1%", up:true },
          ].map(({ label, value, icon, change, up }) => (
            <div key={label} className="bg-[#1A1A1A] rounded-2xl p-5 text-white flex items-center gap-4">
              <div className="text-3xl">{icon}</div>
              <div>
                <p className="text-xs text-gray-400 mb-1">{label}</p>
                <p className="text-2xl font-bold">{value}</p>
                <p className={`text-xs mt-1 flex items-center gap-1 ${up?"text-green-400":"text-red-400"}`}>
                  <TrendingUp size={11}/> {change}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* My Review Queue */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 mb-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-semibold text-gray-900 text-sm">📋 My Review Queue</p>
              <p className="text-xs text-gray-400 mt-0.5">Articles you have voluntarily picked up to review</p>
            </div>
            <Link href="/dashboard/subject-expert/explore"
              className="bg-[#111] text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-[#333] transition-colors cursor-pointer">
              Find Articles to Review
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Article","Domain","Writer","Date Picked Up","Urgency","Action"].map(h => (
                    <th key={h} className="text-xs text-gray-400 font-medium pb-3 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {QUEUE.map(a => (
                  <tr key={a.id} className="border-b border-gray-50 last:border-0">
                    <td className="py-3">
                      <p className="text-sm text-gray-800 font-medium">{a.title}</p>
                      <p className="text-xs text-gray-400">{a.id}</p>
                    </td>
                    <td className="py-3 text-xs text-gray-500">{a.domain}</td>
                    <td className="py-3 text-xs text-gray-500">{a.writer}</td>
                    <td className="py-3 text-xs text-gray-500">{a.submitted}</td>
                    <td className="py-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${urgencyBadge(a.urgency)}`}>
                        {a.urgency}
                      </span>
                    </td>
                    <td className="py-3">
                      <button className="text-xs text-gray-500 hover:text-gray-900 underline cursor-pointer transition-colors">
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Decisions */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <p className="font-semibold text-gray-900 text-sm mb-4">📝 Recent Decisions</p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px]">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Article","Decision","Accuracy Score","Date"].map(h => (
                    <th key={h} className="text-xs text-gray-400 font-medium pb-3 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {RECENT.map(r => (
                  <tr key={r.id} className="border-b border-gray-50 last:border-0">
                    <td className="py-3">
                      <p className="text-sm text-gray-800 font-medium">{r.title}</p>
                      <p className="text-xs text-gray-400">{r.id}</p>
                    </td>
                    <td className="py-3">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        r.decision === "Approved"
                          ? "bg-green-50 text-green-600 border border-green-100"
                          : "bg-orange-50 text-orange-500 border border-orange-100"
                      }`}>
                        {r.decision}
                      </span>
                    </td>
                    <td className="py-3 text-sm text-gray-700 font-semibold">{r.score} / 5</td>
                    <td className="py-3 text-xs text-gray-500">{r.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
