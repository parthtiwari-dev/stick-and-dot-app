"use client";
import { useState, useEffect } from "react";
import { Star, LayoutDashboard, Compass, FilePlus, Settings, FolderOpen, BookOpen, ClipboardList, Users, Upload } from "lucide-react";
import Link from "next/link";
import { getStoredRole, rawToDash } from "@/lib/roles";

function Stars({ n, size = 12 }: { n: number; size?: number }) {
  return (
    <span className="flex gap-0.5">
      {[1,2,3,4,5].map(i=>(
        <Star key={i} size={size} fill={i<=n?"#F97316":"none"} className={i<=n?"text-[#F97316]":"text-gray-300"}/>
      ))}
    </span>
  );
}

const COMMENTS = Array(8).fill(null).map((_,i)=>({
  name:"Shaivya S.", date:"10/2/2023", quality: i%2===0?5:4, comment:"Lorem ipsum dolor Lorem ipsum dolor",
}));

const WRITER_TOOLS = [
  { label:"Readability", desc:"Check reading ease score" },
  { label:"Grammar",     desc:"Detect grammar issues" },
  { label:"AI",          desc:"AI writing suggestions" },
  { label:"Plagiarism",  desc:"Check for originality" },
  { label:"WPS",         desc:"Words per sentence" },
  { label:"SPP",         desc:"Sentences per paragraph" },
  { label:"RW",          desc:"Readability wizard" },
];

/* Role-based sidebar nav */
const NAV_BY_ROLE: Record<string, { label:string; href:string; icon:React.ComponentType<{size?:number;strokeWidth?:number}> }[]> = {
  writer: [
    { label:"Dashboard", href:"/dashboard/writer",           icon:LayoutDashboard },
    { label:"Explore",   href:"/dashboard/writer/explore",   icon:Compass },
    { label:"Create",    href:"/dashboard/writer/create",    icon:FilePlus },
    { label:"Portfolio", href:"/dashboard/writer/portfolio", icon:FolderOpen },
    { label:"Settings",  href:"/dashboard/writer/settings",  icon:Settings },
  ],
  reader: [
    { label:"Dashboard",    href:"/dashboard/reader",              icon:LayoutDashboard },
    { label:"Explore",      href:"/explore",                       icon:Compass },
    { label:"Reading List", href:"/dashboard/reader/reading-list", icon:BookOpen },
    { label:"Settings",     href:"/dashboard/reader/settings",     icon:Settings },
  ],
  "subject-expert": [
    { label:"Dashboard", href:"/dashboard/subject-expert",           icon:LayoutDashboard },
    { label:"Explore",   href:"/dashboard/subject-expert/explore",   icon:Compass },
    { label:"Portfolio", href:"/dashboard/subject-expert/portfolio", icon:FolderOpen },
    { label:"Settings",  href:"/dashboard/subject-expert/settings",  icon:Settings },
  ],
  business: [
    { label:"Dashboard",  href:"/dashboard/business",            icon:LayoutDashboard },
    { label:"Commission", href:"/dashboard/business/commission", icon:ClipboardList },
    { label:"Writers",    href:"/dashboard/business/writers",    icon:Users },
    { label:"Settings",   href:"/dashboard/business/settings",   icon:Settings },
  ],
};

export default function ArticlePage() {
  const [comment, setComment] = useState("");
  const [role, setRole] = useState("reader");
  const [activeTool, setActiveTool] = useState<string|null>(null);

  useEffect(()=>{ setRole(rawToDash(getStoredRole())); }, []);

  const navItems = NAV_BY_ROLE[role] ?? NAV_BY_ROLE.reader;
  const isWriter = role === "writer";

  return (
    <div className="flex min-h-screen bg-white flex-col">
      <div className="flex flex-1">

        {/* Slim dark sidebar — role-aware nav */}
        <aside className="hidden md:flex fixed top-0 left-0 h-screen w-[60px] bg-[#0A0A0A] flex-col items-center z-20 rounded-r-2xl py-5 gap-1">
          {navItems.map(({ label, href, icon: Icon }) => (
            <Link key={href} href={href} title={label}
              className="text-gray-500 hover:text-white transition-colors p-2.5 rounded-xl hover:bg-white/5 w-full flex justify-center">
              <Icon size={17} strokeWidth={1.5}/>
            </Link>
          ))}
        </aside>

        {/* Main */}
        <main className="md:ml-[60px] flex-1 w-full">
          <div className="max-w-4xl mx-auto px-6 md:px-12 py-10">

            {/* Title & meta */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-3 leading-tight">
              The World&apos;s Most Dangerous Technology Ever Made.
            </h1>
            <div className="text-center mb-1">
              <p className="text-xs text-gray-400">
                Ralph Hawkins · May 7, 2019 ·{" "}
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-400 inline-block"/>
                  10 mins read
                </span>
              </p>
              <p className="text-xs text-gray-400 mt-0.5">#technology #tech #career</p>
            </div>

            {/* Keywords + Engagement + Writer Tools */}
            <div className="bg-[#1A1A1A] rounded-2xl p-5 mb-6 mt-6">
              <div className="flex flex-col sm:flex-row gap-6">
                {/* Left — keywords + tools */}
                <div className="flex-1">
                  <p className="text-white text-sm font-semibold mb-1">Suggested Keywords</p>
                  <p className="text-gray-400 text-xs mb-3">#technology #tech #Career</p>
                  {/* Writer tools (shown for writer role; quality tools for reader/sme) */}
                  {isWriter ? (
                    <>
                      <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-2 font-semibold">Writing Tools</p>
                      <div className="flex flex-wrap gap-2">
                        {WRITER_TOOLS.map(tool => (
                          <button key={tool.label}
                            onClick={()=>setActiveTool(activeTool===tool.label?null:tool.label)}
                            title={tool.desc}
                            className={`text-xs px-3 py-1.5 rounded-full border cursor-pointer transition-all ${
                              activeTool===tool.label
                                ? "bg-orange-500 text-white border-orange-400"
                                : "bg-[#2a2a2a] text-gray-300 border-white/10 hover:border-orange-400 hover:text-white"
                            }`}>
                            {tool.label} ·
                          </button>
                        ))}
                      </div>
                      {activeTool && (
                        <p className="text-gray-500 text-xs mt-2">
                          {WRITER_TOOLS.find(t=>t.label===activeTool)?.desc}
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {["Clarity","Depth","Accuracy","Relevance","Sources","Balance","Insight"].map(k=>(
                        <span key={k} className="bg-[#2a2a2a] text-gray-300 text-xs px-3 py-1.5 rounded-full">{k}</span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right — Engagement */}
                <div className="flex-shrink-0 min-w-[130px] text-right">
                  <p className="text-white text-xs font-semibold mb-1">Engagement</p>
                  <p className="text-white text-4xl font-bold">2.4K</p>
                  <p className="text-gray-400 text-xs mt-1">263 contributions in the last year</p>
                  <svg width="120" height="28" viewBox="0 0 120 28" className="mt-1 ml-auto">
                    <polyline points="0,22 20,18 40,20 60,8 80,12 100,5 120,3" stroke="#4ade80" strokeWidth="1.5" fill="none"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Hero image */}
            <div className="w-full h-56 md:h-72 bg-gradient-to-br from-gray-700 to-gray-500 rounded-2xl mb-8 overflow-hidden flex items-center justify-center">
              <span className="text-white/30 text-lg font-medium">Article Hero Image</span>
            </div>

            {/* Body */}
            <div className="text-sm text-gray-700 leading-loose space-y-5">
              <p>Commodo labore ut nisi laborum amet eu qui magna ullamco ut labore. Aliquip consectetur labore consectetur dolor exercitation est minim quis. Magna non irure qui ex est laborum nulla excepteur qui. Anim Lorem dolore cupidatat pariatur ex tempor. Duis ea excepteur proident ex commodo irure est.</p>
              <p>Nisi commodo qui pariatur enim sint laborum consequat enim in officia. Officia fugiat incididunt commodo et mollit aliqua non aute. Enim dolor eiusmod aliqua amet ipsum in enim eiusmod. Quis exercitation sit velit duis.</p>
              <p>Est Lorem consectetur minim sit eu eiusmod mollit velit. Consectetur voluptate ex amet id eiusmod laborum irure. Aliquip ad qui id exercitation irure amet commodo nisi quis. Occaecat minim incididunt eiusmod nostrud veniam quis culpa.</p>
              <p>Aliquip mollit sunt qui irure. Irure ullamco Lorem excepteur dolor qui ea ad quis. Enim fugiat cillum enim ad occaecat sint qui elit labore mollit sunt laborum fugiat consequat. Voluptate labore sunt duis eu deserunt.</p>
            </div>

            {/* About Author */}
            <div className="mt-10 pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">About the Author</p>
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-500 to-gray-700 flex-shrink-0"/>
                <div>
                  <p className="font-bold text-gray-900 mb-0.5">Arthur Black</p>
                  <p className="text-gray-400 text-xs mb-2">@arthurblack</p>
                  <p className="text-sm text-gray-600 leading-relaxed">Ipsum adipiscing culpa est nisi consequat ex amet magna culpa mollit laborum fugiat veniam tempor irure ea. Reprehenderit labore do tempor eiusmod in consectetur ex sunt id mollit commodo ipsum deserunt quis.</p>
                </div>
              </div>
            </div>

            {/* Comments */}
            <div className="mt-10 pt-6 border-t border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-5">Comments</h2>
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Add a Comment</h3>
                <div className="border-b border-gray-200 pb-2 mb-4 flex items-center justify-between">
                  <input type="text" value={comment} onChange={e=>setComment(e.target.value)}
                    placeholder="Type your Comment"
                    className="flex-1 text-sm text-gray-700 outline-none placeholder:text-gray-300"/>
                  <button className="flex items-center gap-1.5 text-xs text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <Upload size={12}/> Upload
                  </button>
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex-shrink-0"/>
                  <div className="flex-1 text-sm text-gray-500 italic">Shaivya S. · Lorem ipsum dolor sit amet…</div>
                  <button className="text-xs border border-gray-200 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-gray-50">+$XXX</button>
                </div>
              </div>

              {/* Ratings table */}
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    {["Name","Date Created","Quality","Comments"].map(h=>(
                      <th key={h} className="text-xs text-gray-400 font-medium pb-3 text-left">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMMENTS.map((c,i)=>(
                    <tr key={i} className="border-b border-gray-50 last:border-0">
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex-shrink-0"/>
                          <span className="text-sm text-gray-700">{c.name}</span>
                        </div>
                      </td>
                      <td className="py-3 text-sm text-gray-500">{c.date}</td>
                      <td className="py-3"><Stars n={c.quality}/></td>
                      <td className="py-3 text-sm text-gray-400">{c.comment}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
