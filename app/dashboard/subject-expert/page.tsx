"use client";
import AppLayout from "@/components/AppLayout";
import Link from "next/link";
import { useUser } from "@/components/UserContext";
import { Search, CheckCircle, Clock, AlertCircle } from "lucide-react";

const QUEUE = [
  { id:"ART-0041", title:"The Future of EVs in India",         domain:"Technology", writer:"Ravi M.",    submitted:"Apr 10", urgency:"high"   },
  { id:"ART-0042", title:"Top Finance Hacks for Gen-Z",         domain:"Finance",    writer:"Neha S.",    submitted:"Apr 10", urgency:"medium" },
  { id:"ART-0043", title:"AI in Healthcare: What Doctors Say",  domain:"Medical",    writer:"Priya K.",   submitted:"Apr 9",  urgency:"high"   },
  { id:"ART-0044", title:"Sustainable Fashion on a Budget",     domain:"Business",   writer:"Sara T.",    submitted:"Apr 8",  urgency:"low"    },
  { id:"ART-0045", title:"Quantum Computing Explained Simply",  domain:"Science",    writer:"Aman G.",    submitted:"Apr 7",  urgency:"medium" },
];

const RECENT = [
  { id:"ART-0038", title:"Climate Policy 2025",        decision:"Approved",         date:"Apr 9"  },
  { id:"ART-0039", title:"Crypto Regulations in India", decision:"Request Revision", date:"Apr 8"  },
  { id:"ART-0040", title:"Mental Health at Work",       decision:"Approved",         date:"Apr 7"  },
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

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-5">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Dashboard&gt;Expert</p>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Welcome, {userName}</h1>
            <p className="text-sm text-gray-500">Your Review Queue</p>
          </div>
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-400 w-40">
            <Search size={13} /><span>Search</span>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-3 gap-4 mb-5">
          {[
            { label:"Pending Review", value:"5",  icon:<Clock size={20} className="text-orange-400"/>, bg:"bg-[#1A1A1A]", textColor:"text-white" },
            { label:"Approved",       value:"18", icon:<CheckCircle size={20} className="text-green-400"/>, bg:"bg-[#1A1A1A]", textColor:"text-white" },
            { label:"Revisions Sent", value:"4",  icon:<AlertCircle size={20} className="text-red-400"/>, bg:"bg-[#1A1A1A]", textColor:"text-white" },
          ].map(({ label, value, icon, bg, textColor }) => (
            <div key={label} className={`${bg} rounded-2xl p-5 flex items-center gap-4`}>
              <div>{icon}</div>
              <div>
                <p className="text-xs text-gray-400 mb-1">{label}</p>
                <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Review Queue */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 mb-5">
          <div className="flex items-center justify-between mb-4">
            <p className="font-semibold text-gray-900 text-sm">📋 Articles Awaiting Your Review</p>
            <Link href="/dashboard/subject-expert/create"
              className="bg-[#111] text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-[#333] transition-colors cursor-pointer">
              + Submit Review
            </Link>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {["Article","Domain","Writer","Submitted","Priority","Action"].map(h => (
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
                    <Link href="/dashboard/subject-expert/create"
                      className="text-xs text-gray-500 hover:text-gray-900 underline cursor-pointer transition-colors">
                      Review
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent Feedback Log */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <p className="font-semibold text-gray-900 text-sm mb-4">📝 Recent Feedback Submitted</p>
          <div className="flex flex-col gap-3">
            {RECENT.map(r => (
              <div key={r.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm text-gray-800 font-medium">{r.title}</p>
                  <p className="text-xs text-gray-400">{r.id} · {r.date}</p>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  r.decision === "Approved"
                    ? "bg-green-50 text-green-600 border border-green-100"
                    : "bg-orange-50 text-orange-500 border border-orange-100"
                }`}>
                  {r.decision}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
