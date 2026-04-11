"use client";
import AppLayout from "@/components/AppLayout";
import Link from "next/link";
import { Search } from "lucide-react";

export default function NotFound() {
  return (
    <AppLayout bg="bg-white">
      <div className="min-h-screen bg-white relative overflow-hidden">
        {/* Search top right */}
        <div className="flex justify-end p-6">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-5 py-2.5 text-sm text-gray-400 w-52">
            <Search size={14}/><span>Search</span>
          </div>
        </div>

        {/* Subtle background circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
          {[350,500,650,800].map(s=>(
            <div key={s} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gray-200"
              style={{width:s,height:s}}/>
          ))}
          {/* Decorative swoosh */}
          <svg className="absolute top-20 right-20" width="200" height="300" viewBox="0 0 200 300">
            <path d="M50,0 Q200,100 100,200 Q0,300 150,300" stroke="#e5e7eb" strokeWidth="40" fill="none" strokeLinecap="round"/>
          </svg>
        </div>

        <div className="relative flex flex-col items-center justify-center pb-20" style={{minHeight:"calc(100vh - 80px)"}}>
          {/* 404 with moon as the 0 */}
          <div className="relative mb-6">
            <div className="flex items-center justify-center gap-2">
              <span className="font-black text-gray-800" style={{fontSize:"10rem",lineHeight:1,letterSpacing:"-0.05em"}}>4</span>
              {/* Moon illustration as 0 */}
              <div className="relative" style={{width:160,height:160}}>
                <svg width="160" height="160" viewBox="0 0 160 160">
                  <circle cx="80" cy="80" r="72" fill="#9ca3af"/>
                  <circle cx="80" cy="80" r="72" fill="none" stroke="#6b7280" strokeWidth="2"/>
                  {/* Craters */}
                  <circle cx="55" cy="55" r="14" fill="#6b7280" opacity="0.6"/>
                  <circle cx="100" cy="70" r="8" fill="#6b7280" opacity="0.5"/>
                  <circle cx="70" cy="100" r="10" fill="#6b7280" opacity="0.4"/>
                  <circle cx="110" cy="100" r="6" fill="#6b7280" opacity="0.5"/>
                  <circle cx="45" cy="90" r="5" fill="#6b7280" opacity="0.4"/>
                </svg>
              </div>
              <span className="font-black text-gray-800" style={{fontSize:"10rem",lineHeight:1,letterSpacing:"-0.05em"}}>4</span>
            </div>

            {/* Stars */}
            {[[20,20],[280,30],[50,160],[300,150],[160,10],[350,90]].map(([x,y],i)=>(
              <div key={i} className="absolute text-gray-400 text-xs font-bold" style={{left:x,top:y}}>+</div>
            ))}
          </div>

          {/* Astronaut */}
          <div className="mb-8">
            <svg width="160" height="180" viewBox="0 0 160 180">
              {/* Suit */}
              <ellipse cx="80" cy="100" rx="30" ry="38" fill="#9ca3af" stroke="#6b7280" strokeWidth="1"/>
              {/* Helmet */}
              <circle cx="80" cy="58" r="26" fill="#d1d5db" stroke="#9ca3af" strokeWidth="2"/>
              <circle cx="80" cy="58" r="18" fill="#e5e7eb" opacity="0.8"/>
              {/* Face */}
              <circle cx="74" cy="55" r="3" fill="#6b7280"/>
              <circle cx="86" cy="55" r="3" fill="#6b7280"/>
              <path d="M74,63 Q80,67 86,63" stroke="#6b7280" strokeWidth="1.5" fill="none"/>
              {/* Arms */}
              <ellipse cx="46" cy="102" rx="10" ry="22" fill="#9ca3af" stroke="#6b7280" strokeWidth="1" transform="rotate(-20 46 102)"/>
              <ellipse cx="114" cy="95" rx="10" ry="22" fill="#9ca3af" stroke="#6b7280" strokeWidth="1" transform="rotate(35 114 95)"/>
              {/* Legs */}
              <ellipse cx="66" cy="142" rx="10" ry="22" fill="#9ca3af" stroke="#6b7280" strokeWidth="1" transform="rotate(10 66 142)"/>
              <ellipse cx="94" cy="140" rx="10" ry="22" fill="#9ca3af" stroke="#6b7280" strokeWidth="1" transform="rotate(-5 94 140)"/>
              {/* Boots */}
              <ellipse cx="62" cy="162" rx="12" ry="8" fill="#6b7280"/>
              <ellipse cx="95" cy="160" rx="12" ry="8" fill="#6b7280"/>
              {/* Tether */}
              <path d="M110,90 Q130,40 80,10" stroke="#9ca3af" strokeWidth="2" fill="none"/>
              <circle cx="80" cy="10" r="5" fill="#F97316"/>
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">How can we help you?</h2>
          <p className="text-sm text-gray-400 mb-8">You can try the following options</p>

          <div className="flex gap-4">
            <Link href="/">
              <button className="px-8 py-4 bg-[#1A1A2E] text-white text-sm font-semibold rounded-xl hover:bg-[#111] transition-all cursor-pointer">
                Options available on internet
              </button>
            </Link>
            <Link href="/signup">
              <button className="px-8 py-4 bg-gray-800 text-white text-sm font-semibold rounded-xl hover:bg-gray-900 transition-all cursor-pointer">
                Start your own content
              </button>
            </Link>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
