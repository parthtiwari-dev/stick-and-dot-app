"use client";
import Link from "next/link";
import AppLayout from "@/components/AppLayout";
import { Search } from "lucide-react";

export default function NotFound() {
  return (
    <AppLayout>
      <div className="min-h-screen bg-white flex flex-col">
        {/* Search bar top right */}
        <div className="flex justify-end p-6">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-400 w-44">
            <Search size={13}/><span>Search</span>
          </div>
        </div>

        {/* Center content */}
        <div className="flex-1 flex flex-col items-center justify-center pb-20 relative overflow-hidden">
          {/* Background circles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[200,300,400,500].map(s => (
              <div key={s} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gray-100"
                style={{width:s, height:s}}/>
            ))}
          </div>

          {/* 404 text */}
          <div className="relative z-10 text-center mb-8">
            <p className="font-black text-gray-900 leading-none select-none" style={{fontSize:"9rem",letterSpacing:"-0.05em"}}>
              4<span>0</span>4
            </p>
            <div className="flex justify-center -mt-6 mb-2">
              {/* Floating astronaut illustration */}
              <svg width="120" height="100" viewBox="0 0 120 100">
                <circle cx="60" cy="30" r="22" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="1"/>
                <circle cx="60" cy="28" r="14" fill="#f9fafb"/>
                <circle cx="55" cy="26" r="3" fill="#9ca3af"/>
                <circle cx="65" cy="26" r="3" fill="#9ca3af"/>
                <rect x="45" y="52" width="30" height="28" rx="6" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="1"/>
                <rect x="35" y="56" width="12" height="18" rx="4" fill="#d1d5db"/>
                <rect x="73" y="56" width="12" height="18" rx="4" fill="#d1d5db"/>
                <rect x="50" y="80" width="8" height="16" rx="3" fill="#d1d5db"/>
                <rect x="62" y="80" width="8" height="16" rx="3" fill="#d1d5db"/>
                <circle cx="82" cy="90" r="4" fill="#F97316"/>
                <line x1="82" y1="90" x2="82" y2="40" stroke="#9ca3af" strokeWidth="1" strokeDasharray="3 2"/>
              </svg>
            </div>
          </div>

          <h2 className="text-xl font-bold text-gray-800 mb-2 relative z-10">How can we help you?</h2>
          <p className="text-sm text-gray-400 mb-8 relative z-10">The page you are looking for doesn&apos;t exist.</p>

          <div className="flex gap-4 relative z-10">
            <Link href="/">
              <button className="px-6 py-3 bg-[#111] text-white text-sm font-semibold rounded-xl hover:bg-[#333] transition-all cursor-pointer">
                Take me back to home
              </button>
            </Link>
            <Link href="/signup">
              <button className="px-6 py-3 bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-all cursor-pointer">
                Start your dot content
              </button>
            </Link>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
