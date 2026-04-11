"use client";
import Link from "next/link";
import { Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-screen w-[200px] bg-[#0A0A0A] flex flex-col z-20 rounded-r-2xl hidden md:flex">
        <div className="px-5 pt-7 pb-5">
          <span className="text-white text-base font-bold tracking-tight underline underline-offset-2">Stick&amp;Dot.</span>
        </div>
        <nav className="flex flex-col gap-0.5 px-3 flex-1">
          {[
            { label: "Dashboard", href: "#" },
            { label: "Resources", href: "/resources" },
            { label: "Settings",  href: "#" },
            { label: "Lorem Ipsum", href: "#" },
          ].map(({ label, href }) => (
            <Link key={label} href={href}
              className="flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all">
              {label}
            </Link>
          ))}
          <div className="my-2 border-t border-white/10"/>
          {["Profile","Sign In","Sign Up"].map(l => (
            <Link key={l} href="/signup"
              className="flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all">
              {l}
            </Link>
          ))}
        </nav>
        <div className="px-5 pb-6 mt-auto">
          <p className="text-gray-600 text-sm font-bold">Logo</p>
        </div>
      </aside>

      {/* Main */}
      <main className="md:ml-[200px] flex-1 min-h-screen bg-white relative overflow-hidden">
        <div className="flex justify-end p-6">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-5 py-2.5 text-sm text-gray-400 w-52">
            <Search size={14}/><span>Search</span>
          </div>
        </div>

        {/* Background rings */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[350,500,650,800].map(s => (
            <div key={s} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gray-100 opacity-40"
              style={{width:s,height:s}}/>
          ))}
          <svg className="absolute top-16 right-16 opacity-20" width="200" height="280" viewBox="0 0 200 280">
            <path d="M50,0 Q200,100 100,180 Q0,260 150,280" stroke="#e5e7eb" strokeWidth="50" fill="none" strokeLinecap="round"/>
          </svg>
        </div>

        <div className="relative flex flex-col items-center justify-center pb-16 pt-4" style={{minHeight:"calc(100vh - 80px)"}}>
          {/* 404 */}
          <div className="relative mb-4">
            <div className="flex items-center justify-center gap-1">
              <span className="font-black text-gray-800 select-none" style={{fontSize:"clamp(5rem,10vw,10rem)",lineHeight:1,letterSpacing:"-0.05em"}}>4</span>
              <div className="relative" style={{width:"clamp(100px,12vw,160px)",height:"clamp(100px,12vw,160px)"}}>
                <svg viewBox="0 0 160 160" className="w-full h-full">
                  <circle cx="80" cy="80" r="72" fill="#9ca3af"/>
                  <circle cx="80" cy="80" r="72" fill="none" stroke="#6b7280" strokeWidth="2"/>
                  <circle cx="55" cy="55" r="14" fill="#6b7280" opacity="0.6"/>
                  <circle cx="100" cy="70" r="8" fill="#6b7280" opacity="0.5"/>
                  <circle cx="70" cy="105" r="10" fill="#6b7280" opacity="0.4"/>
                  <circle cx="110" cy="100" r="6" fill="#6b7280" opacity="0.5"/>
                  <circle cx="45" cy="95" r="5" fill="#6b7280" opacity="0.4"/>
                </svg>
              </div>
              <span className="font-black text-gray-800 select-none" style={{fontSize:"clamp(5rem,10vw,10rem)",lineHeight:1,letterSpacing:"-0.05em"}}>4</span>
            </div>
            {/* Stars */}
            {[[20,20],[280,30],[50,160],[300,150],[160,10],[350,90]].map(([x,y],i)=>(
              <div key={i} className="absolute text-gray-300 text-xs font-bold" style={{left:x,top:y}}>+</div>
            ))}
          </div>

          {/* Astronaut SVG */}
          <div className="mb-8">
            <svg width="140" height="170" viewBox="0 0 160 180">
              <ellipse cx="80" cy="100" rx="30" ry="38" fill="#9ca3af" stroke="#6b7280" strokeWidth="1"/>
              <circle cx="80" cy="58" r="26" fill="#d1d5db" stroke="#9ca3af" strokeWidth="2"/>
              <circle cx="80" cy="58" r="18" fill="#e5e7eb" opacity="0.8"/>
              <circle cx="74" cy="55" r="3" fill="#6b7280"/>
              <circle cx="86" cy="55" r="3" fill="#6b7280"/>
              <path d="M74,63 Q80,67 86,63" stroke="#6b7280" strokeWidth="1.5" fill="none"/>
              <ellipse cx="46" cy="102" rx="10" ry="22" fill="#9ca3af" stroke="#6b7280" strokeWidth="1" transform="rotate(-20 46 102)"/>
              <ellipse cx="114" cy="95" rx="10" ry="22" fill="#9ca3af" stroke="#6b7280" strokeWidth="1" transform="rotate(35 114 95)"/>
              <ellipse cx="66" cy="142" rx="10" ry="22" fill="#9ca3af" stroke="#6b7280" strokeWidth="1" transform="rotate(10 66 142)"/>
              <ellipse cx="94" cy="140" rx="10" ry="22" fill="#9ca3af" stroke="#6b7280" strokeWidth="1" transform="rotate(-5 94 140)"/>
              <ellipse cx="62" cy="162" rx="12" ry="8" fill="#6b7280"/>
              <ellipse cx="95" cy="160" rx="12" ry="8" fill="#6b7280"/>
              <path d="M110,90 Q130,40 80,10" stroke="#9ca3af" strokeWidth="2" fill="none"/>
              <circle cx="80" cy="10" r="5" fill="#F97316"/>
            </svg>
          </div>

          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">How can we help you?</h2>
          <p className="text-sm text-gray-400 mb-8">You can try the following options</p>

          <div className="flex flex-wrap gap-3 justify-center px-4">
            <Link href="/explore">
              <button className="px-6 py-4 bg-[#1A1A2E] text-white text-sm font-semibold rounded-xl hover:bg-[#111] transition-all cursor-pointer">
                Options available on internet
              </button>
            </Link>
            <Link href="/signup">
              <button className="px-6 py-4 bg-gray-800 text-white text-sm font-semibold rounded-xl hover:bg-gray-900 transition-all cursor-pointer">
                How to make a pitch?
              </button>
            </Link>
            <Link href="/signup">
              <button className="px-6 py-4 bg-gray-700 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-all cursor-pointer">
                Start your own Series
              </button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
