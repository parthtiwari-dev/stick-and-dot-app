"use client";
import { useUser } from "@/components/UserContext";
import AppLayout from "@/components/AppLayout";
import Link from "next/link";
import { Search, Edit2, Star } from "lucide-react";

const REVIEWS = [
  { article: "AI in Healthcare 2026",      verdict: "Approved",           rating: 4, date: "10 Apr 2026" },
  { article: "Quantum Computing Basics",   verdict: "Revision Requested", rating: 3, date: "8 Apr 2026"  },
  { article: "The Future of CRISPR",       verdict: "Approved",           rating: 5, date: "5 Apr 2026"  },
];

const VERDICTCLS: Record<string, string> = {
  "Approved":           "bg-green-50 text-green-600",
  "Revision Requested": "bg-yellow-50 text-yellow-600",
};

function StarRow({ n }: { n: number }) {
  return <span className="flex gap-0.5">{[1,2,3,4,5].map(i=><Star key={i} size={11} fill={i<=n?"#F97316":"none"} className={i<=n?"text-[#F97316]":"text-gray-300"}/>)}</span>;
}

export default function SubjectExpertProfile() {
  const { userName } = useUser();
  return (
    <AppLayout bg="bg-[#F4F4F4]">
      <div className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">
              <Link href="/dashboard/subject-expert" className="hover:text-gray-700">Dashboard</Link>&gt;Profile
            </p>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">My Profile</h1>
          </div>
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-400 w-44">
            <Search size={13} /><span>Search</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-5">
          {/* Profile card */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 w-full lg:w-[280px] flex-shrink-0">
            <div className="flex flex-col items-center mb-5">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-400 to-green-500 flex items-center justify-center text-4xl mb-3">👤</div>
              <p className="text-gray-900 font-semibold text-base">{userName}</p>
              <p className="text-gray-500 text-xs mb-1">Subject Matter Expert</p>
              <p className="text-gray-400 text-xs">@shaivyasaini</p>
            </div>

            <div className="flex justify-around mb-5 py-4 border-y border-gray-100">
              {[{ label:"Reviews", val:"38" }, { label:"Approved", val:"29" }, { label:"Avg Score", val:"4.4" }].map(s => (
                <div key={s.label} className="text-center">
                  <p className="text-gray-900 font-bold text-base">{s.val}</p>
                  <p className="text-gray-400 text-xs">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="space-y-2 mb-5">
              <div><p className="text-xs text-gray-400 mb-0.5">Domain</p><p className="text-sm text-gray-700">Medical / Health, Science</p></div>
              <div><p className="text-xs text-gray-400 mb-0.5">Credentials</p><p className="text-sm text-gray-700">PhD Biology, Stanford</p></div>
              <div><p className="text-xs text-gray-400 mb-0.5">Member since</p><p className="text-sm text-gray-700">February 2023</p></div>
            </div>

            <p className="text-xs text-gray-400 mb-1 font-medium">Bio</p>
            <p className="text-xs text-gray-500 leading-relaxed mb-5">
              Biological researcher with expertise in genomics and biotech. I review articles for accuracy and ensure readers get trustworthy information.
            </p>

            <Link href="/dashboard/subject-expert/settings">
              <button className="w-full py-3 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold cursor-pointer hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                <Edit2 size={14} />Edit Profile
              </button>
            </Link>
          </div>

          {/* Reviews history */}
          <div className="flex-1 bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-5">
              <p className="text-gray-900 font-semibold">Recent Reviews</p>
              <Link href="/dashboard/subject-expert/explore" className="text-xs text-gray-400 hover:text-gray-700">Submit New</Link>
            </div>
            <div className="flex flex-col gap-4">
              {REVIEWS.map((r, i) => (
                <div key={i} className="flex items-start justify-between py-4 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-800 mb-1">{r.article}</p>
                    <p className="text-xs text-gray-400 mb-2">{r.date}</p>
                    <StarRow n={r.rating} />
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ml-3 ${VERDICTCLS[r.verdict]}`}>{r.verdict}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
