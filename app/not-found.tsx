"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useState } from "react";
import AppLayout from "@/components/AppLayout";

function BlobBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <svg className="absolute -top-32 -left-32 w-[520px] h-[520px] opacity-[0.05]" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <path fill="#111111" d="M42.7,-62.9C53.9,-53.5,60.5,-38.6,66.3,-23.1C72,-7.5,76.8,8.7,72.5,22.5C68.3,36.3,54.9,47.7,40.8,56.4C26.7,65.1,11.8,71.1,-3.6,75.6C-19,80.1,-35.1,83.1,-47.4,75.8C-59.7,68.4,-68.2,50.7,-71.9,33.1C-75.6,15.4,-74.5,-2.2,-68.7,-17.5C-62.9,-32.9,-52.3,-46,-39.9,-55.5C-27.4,-65.1,-13.7,-71.2,1.4,-73C16.5,-74.9,31.5,-72.3,42.7,-62.9Z" transform="translate(100 100)" />
      </svg>
      <svg className="absolute -bottom-40 -right-20 w-[600px] h-[600px] opacity-[0.04]" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <path fill="#111111" d="M48.2,-67.3C60.3,-57.9,66.8,-41.8,70.8,-25.6C74.8,-9.4,76.3,6.9,71.2,21C66.1,35.1,54.4,47,41.2,56.5C28,65.9,13.3,73,-2.1,75.7C-17.5,78.5,-34.9,76.8,-47.4,68C-60,59.2,-67.6,43.3,-71.2,27C-74.8,10.6,-74.4,-6.2,-68.6,-20.7C-62.8,-35.1,-51.6,-47.2,-38.8,-56.5C-26.1,-65.9,-13,-72.4,2.4,-75.6C17.8,-78.8,36.1,-76.7,48.2,-67.3Z" transform="translate(100 100)" />
      </svg>
    </div>
  );
}

function AstronautPlaceholder() {
  return (
    <div className="flex items-center justify-center w-32 h-32 mx-2">
      <svg viewBox="0 0 80 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Lost astronaut">
        <ellipse cx="40" cy="28" rx="18" ry="20" fill="#1f2937" />
        <ellipse cx="40" cy="27" rx="12" ry="13" fill="#374151" opacity="0.6" />
        <ellipse cx="35" cy="22" rx="4" ry="5" fill="white" opacity="0.15" />
        <rect x="24" y="44" width="32" height="28" rx="8" fill="#1f2937" />
        <rect x="34" y="46" width="12" height="6" rx="2" fill="#374151" />
        <rect x="33" y="52" width="14" height="10" rx="3" fill="#374151" />
        <circle cx="37" cy="57" r="2" fill="#6b7280" />
        <circle cx="43" cy="57" r="2" fill="#6b7280" />
        <rect x="10" y="46" width="14" height="8" rx="4" fill="#1f2937" />
        <rect x="56" y="46" width="14" height="8" rx="4" fill="#1f2937" />
        <ellipse cx="14" cy="58" rx="5" ry="4" fill="#374151" />
        <ellipse cx="66" cy="58" rx="5" ry="4" fill="#374151" />
        <rect x="27" y="70" width="11" height="18" rx="5" fill="#1f2937" />
        <rect x="42" y="70" width="11" height="18" rx="5" fill="#1f2937" />
        <ellipse cx="32" cy="88" rx="7" ry="4" fill="#374151" />
        <ellipse cx="48" cy="88" rx="7" ry="4" fill="#374151" />
        <rect x="54" y="47" width="8" height="14" rx="3" fill="#374151" />
        <circle cx="10" cy="15" r="1.5" fill="#9ca3af" />
        <circle cx="68" cy="10" r="1" fill="#9ca3af" />
        <circle cx="72" cy="32" r="1.5" fill="#9ca3af" />
        <circle cx="5" cy="45" r="1" fill="#9ca3af" />
        <circle cx="75" cy="65" r="1.2" fill="#9ca3af" />
      </svg>
    </div>
  );
}

function NotFoundContent() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    /* ✅ KEY FIX: explicit bg-white and text-gray-900 — no more dark inheritance */
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-white text-gray-900">
      <BlobBackground />

      {/* Top-right search */}
      <div className="relative z-10 flex justify-end px-10 pt-8">
        <form onSubmit={handleSearch} className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="bg-gray-100 text-sm text-gray-700 placeholder-gray-400 pl-9 pr-4 py-2 rounded-full w-56 border border-transparent focus:border-gray-300 outline-none transition-all duration-200"
          />
        </form>
      </div>

      {/* Center content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 -mt-8">
        <div className="flex items-center justify-center gap-0 mb-8">
          <span className="text-[130px] font-black text-gray-800 leading-none tracking-tighter select-none">
            4
          </span>
          <AstronautPlaceholder />
          <span className="text-[130px] font-black text-gray-800 leading-none tracking-tighter select-none">
            4
          </span>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-2">How can we help you?</h2>
        <p className="text-sm text-gray-500 mb-8">You can try the following options</p>

        <div className="flex items-center gap-3 flex-wrap justify-center">
          <button
            onClick={() => router.push("/explore")}
            className="px-5 py-3 rounded-lg bg-[#111111] text-white text-sm font-medium hover:bg-[#2a2a2a] active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            Options available on internet
          </button>
          <button
            onClick={() => router.push("/create")}
            className="px-5 py-3 rounded-lg bg-[#111111] text-white text-sm font-medium hover:bg-[#2a2a2a] active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            Start your own content
          </button>
        </div>
      </div>
    </div>
  );
}

export default function NotFound() {
  return (
    <AppLayout>
      <NotFoundContent />
    </AppLayout>
  );
}
