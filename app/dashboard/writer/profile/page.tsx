"use client";
import { useUser } from "@/components/UserContext";
import AppLayout from "@/components/AppLayout";
import Link from "next/link";
import { Search, Star, Edit2 } from "lucide-react";

const ARTICLES = [
  { title:"The Silent Revolution in Neural Computing", tag:"Technology", rating:4.8, views:"12.4K", date:"Oct 2, 2023" },
  { title:"How Minimalism Took Over the Design World", tag:"Design",     rating:4.5, views:"9.1K",  date:"Sep 14, 2023" },
  { title:"The Hidden Economics of Attention",         tag:"Finance",    rating:4.9, views:"18.7K", date:"Aug 30, 2023" },
];

function StarRow({ n }: { n: number }) {
  return (
    <span className="flex gap-0.5">
      {[1,2,3,4,5].map(i => <Star key={i} size={11} fill={i<=Math.floor(n)?"#F97316":"none"} className={i<=Math.floor(n)?"text-[#F97316]":"text-gray-300"} />)}
    </span>
  );
}

export default function WriterProfile() {
  const { userName } = useUser();
  return (
    <AppLayout bg="bg-[#F4F4F4]">
      <div className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">
              <Link href="/dashboard/writer" className="hover:text-gray-700">Dashboard</Link>&gt;Profile
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
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-4xl mb-3">👤</div>
              <p className="text-gray-900 font-semibold text-base">{userName}</p>
              <p className="text-gray-500 text-xs mb-1">Content Writer</p>
              <p className="text-gray-400 text-xs">@shaivyasaini</p>
            </div>

            <div className="flex justify-around mb-5 py-4 border-y border-gray-100">
              {[{ label: "Articles", val: "24" }, { label: "Followers", val: "1.2K" }, { label: "Avg Rating", val: "4.7" }].map(s => (
                <div key={s.label} className="text-center">
                  <p className="text-gray-900 font-bold text-base">{s.val}</p>
                  <p className="text-gray-400 text-xs">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="space-y-2 mb-5">
              <div><p className="text-xs text-gray-400 mb-0.5">Domain</p><p className="text-sm text-gray-700">Technology, Finance</p></div>
              <div><p className="text-xs text-gray-400 mb-0.5">Location</p><p className="text-sm text-gray-700">Mumbai, India</p></div>
              <div><p className="text-xs text-gray-400 mb-0.5">Member since</p><p className="text-sm text-gray-700">January 2023</p></div>
            </div>

            <p className="text-xs text-gray-400 mb-1 font-medium">Bio</p>
            <p className="text-xs text-gray-500 leading-relaxed mb-5">
              Tech and finance writer with 5+ years of experience. I break down complex topics into clear, engaging content for both technical and general audiences.
            </p>

            <Link href="/dashboard/writer/settings">
              <button className="w-full py-3 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold cursor-pointer hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                <Edit2 size={14} />Edit Profile
              </button>
            </Link>
          </div>

          {/* Published articles */}
          <div className="flex-1 bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-5">
              <p className="text-gray-900 font-semibold">Published Articles</p>
              <Link href="/portfolio" className="text-xs text-gray-400 hover:text-gray-700 transition-colors">View Portfolio</Link>
            </div>
            <div className="flex flex-col gap-4">
              {ARTICLES.map((a, i) => (
                <div key={i} className="flex items-start justify-between py-4 border-b border-gray-50 last:border-0">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{a.tag}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-800 mb-1">{a.title}</p>
                    <p className="text-xs text-gray-400">{a.date}</p>
                  </div>
                  <div className="text-right ml-4 flex-shrink-0">
                    <StarRow n={a.rating} />
                    <p className="text-xs text-gray-400 mt-1">{a.views} views</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Link href="/portfolio">
                <button className="w-full py-3 rounded-xl bg-[#111] text-white text-sm font-semibold hover:bg-[#333] transition-colors cursor-pointer">
                  View Full Portfolio
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
