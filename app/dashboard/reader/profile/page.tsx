"use client";
import { useUser } from "@/components/UserContext";
import AppLayout from "@/components/AppLayout";
import Link from "next/link";
import { Search, Edit2 } from "lucide-react";

const READING_LISTS = [
  { name: "AI Deep Dives",        count: 8,  genre: "Technology" },
  { name: "Weekend Long Reads",   count: 12, genre: "Culture"    },
  { name: "Finance Fundamentals", count: 5,  genre: "Finance"    },
];

const FAVOURITE_AUTHORS = [
  { name: "Arthur Black",  domain: "Technology", articles: 24 },
  { name: "Jerome Bell",   domain: "Finance",    articles: 18 },
  { name: "Priya Mehta",   domain: "Culture",    articles: 31 },
];

export default function ReaderProfile() {
  const { userName } = useUser();
  return (
    <AppLayout bg="bg-[#F4F4F4]">
      <div className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">
              <Link href="/dashboard/reader" className="hover:text-gray-700">Dashboard</Link>&gt;Profile
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
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-4xl mb-3">👤</div>
              <p className="text-gray-900 font-semibold text-base">{userName}</p>
              <p className="text-gray-500 text-xs mb-1">Avid Reader</p>
              <p className="text-gray-400 text-xs">@shaivyasaini</p>
            </div>

            <div className="flex justify-around mb-5 py-4 border-y border-gray-100">
              {[{ label:"Articles Read", val:"148" }, { label:"Lists", val:"3" }, { label:"Following", val:"12" }].map(s => (
                <div key={s.label} className="text-center">
                  <p className="text-gray-900 font-bold text-base">{s.val}</p>
                  <p className="text-gray-400 text-xs">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="space-y-2 mb-5">
              <div><p className="text-xs text-gray-400 mb-0.5">Interests</p><p className="text-sm text-gray-700">Technology, Culture, Finance</p></div>
              <div><p className="text-xs text-gray-400 mb-0.5">Location</p><p className="text-sm text-gray-700">Delhi, India</p></div>
              <div><p className="text-xs text-gray-400 mb-0.5">Member since</p><p className="text-sm text-gray-700">March 2023</p></div>
            </div>

            <p className="text-xs text-gray-400 mb-1 font-medium">Bio</p>
            <p className="text-xs text-gray-500 leading-relaxed mb-5">
              Curious mind. I read broadly — from tech breakthroughs to cultural essays. Always looking for something that changes how I think.
            </p>

            <Link href="/dashboard/reader/settings">
              <button className="w-full py-3 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold cursor-pointer hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                <Edit2 size={14} />Edit Profile
              </button>
            </Link>
          </div>

          {/* Right panel */}
          <div className="flex-1 flex flex-col gap-5">
            {/* Reading lists */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-900 font-semibold">My Reading Lists</p>
                <Link href="/dashboard/reader/reading-list" className="text-xs text-gray-400 hover:text-gray-700">+ New List</Link>
              </div>
              <div className="flex flex-col gap-3">
                {READING_LISTS.map(l => (
                  <div key={l.name} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{l.name}</p>
                      <p className="text-xs text-gray-400">{l.genre} · {l.count} articles</p>
                    </div>
                    <button className="text-xs text-gray-400 border border-gray-200 px-3 py-1 rounded-lg hover:bg-gray-50 cursor-pointer">View</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Favourite authors */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <p className="text-gray-900 font-semibold mb-4">Following Authors</p>
              <div className="flex flex-col gap-3">
                {FAVOURITE_AUTHORS.map(a => (
                  <div key={a.name} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-300 to-orange-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {a.name[0]}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{a.name}</p>
                      <p className="text-xs text-gray-400">{a.domain} · {a.articles} articles</p>
                    </div>
                    <button className="text-xs text-gray-400 border border-gray-200 px-3 py-1 rounded-lg hover:bg-gray-50 cursor-pointer">Following</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
