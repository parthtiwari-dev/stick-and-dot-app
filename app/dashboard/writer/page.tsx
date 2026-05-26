"use client";
import { useEffect, useState } from "react";
import { useUser } from "@/components/UserContext";
import AppLayout from "@/components/AppLayout";
import Link from "next/link";
import { Star, TrendingUp, TrendingDown } from "lucide-react";
import { formatArticleDate, listCommentsForMyArticles, listMyArticles, type ArticleCommentWithArticle } from "@/lib/supabase/articles";

function Stars({ n }: { n: number }) {
  return (
    <span className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={11} fill={i<=n?"#F97316":"none"} className={i<=n?"text-[#F97316]":"text-gray-300"}/>
      ))}
    </span>
  );
}

const TRAFFIC_PATHS = [
  "M0,110 C40,110 40,90 80,80 C120,70 130,100 160,50 C190,10 220,35 260,20 C300,5 330,25 360,15 C390,5 400,8 400,8",
  "M0,120 C40,115 60,105 100,100 C140,95 160,115 200,90 C240,65 260,75 300,55 C340,35 370,40 400,30",
  "M0,100 C30,95 50,110 90,105 C130,100 150,80 200,70 C250,60 280,85 320,65 C360,45 380,50 400,40",
];

type TopArticle = { id:string; slug:string; rank:number; name:string; rating:number; views:string; path:string };

export default function WriterDashboard() {
  const { userName } = useUser();
  const [topArticles, setTopArticles] = useState<TopArticle[]>([]);
  const [feedbackRows, setFeedbackRows] = useState<ArticleCommentWithArticle[]>([]);
  const [stats, setStats] = useState({ wordsWritten: 0, wordsPending: 0, published: 0 });
  const [selectedId, setSelectedId] = useState("");
  const selected = topArticles.find(a => a.id === selectedId) ?? topArticles[0];

  useEffect(() => {
    let alive = true;
    Promise.all([listMyArticles(), listCommentsForMyArticles(8)])
      .then(([articles, comments]) => {
        if (!alive) return;
        const published = articles.filter(article => article.status === "published");
        const top = published.slice(0, 3).map((article, index) => ({
          id: article.id,
          slug: article.slug,
          rank: index + 1,
          name: article.title,
          rating: 5,
          views: `${article.word_count.toLocaleString("en-IN")} words`,
          path: TRAFFIC_PATHS[index] ?? TRAFFIC_PATHS[0],
        }));
        setTopArticles(top);
        setSelectedId(top[0]?.id ?? "");
        setFeedbackRows(comments);
        setStats({
          wordsWritten: articles.reduce((sum, article) => sum + article.word_count, 0),
          wordsPending: articles
            .filter(article => article.status !== "published")
            .reduce((sum, article) => sum + article.word_count, 0),
          published: published.length,
        });
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  return (
    <AppLayout bg="bg-[#F4F4F4]">
      <div className="p-4 md:p-6 min-h-screen">

        {/* Header — no date/filter/search controls */}
        <div className="mb-5">
          <p className="text-xs text-gray-400 mb-0.5">Dashboard</p>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Welcome, {userName}</h1>
          <p className="text-sm text-gray-500">Your Dashboard</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          {[
            { label:"Words Written",    value:stats.wordsWritten.toLocaleString("en-IN"), icon:"📘", change:`${stats.published} published`, up:true },
            { label:"Words Pending",    value:stats.wordsPending.toLocaleString("en-IN"), icon:"✍️", change:"Drafts + reviews", up:false },
            { label:"Payment Received", value:"Metadata only", icon:"🪙", change:"Gateway later", up:true },
          ].map(({ label, value, icon, change, up }) => (
            <div key={label} className="bg-[#1A1A1A] rounded-2xl p-5 text-white flex items-center gap-4">
              <div className="text-3xl">{icon}</div>
              <div>
                <p className="text-xs text-gray-400 mb-1">{label}</p>
                <p className="text-2xl font-bold">{value}</p>
                <p className={`text-xs mt-1 flex items-center gap-1 ${up?"text-green-400":"text-red-400"}`}>
                  {up?<TrendingUp size={11}/>:<TrendingDown size={11}/>} {change}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Top Articles + Traffic */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">

          {/* Your Top Articles — clickable rows */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <p className="font-semibold text-gray-900 text-sm">Your Top Articles</p>
              <span className="text-xs text-gray-400">Click to view traffic</span>
            </div>
            {topArticles.map(a => (
              <Link
                key={a.id}
                href={`/articles/${a.slug}?own=1`}
                onClick={e => { e.preventDefault(); setSelectedId(a.id); }}
                className={`flex items-center justify-between py-3 border-b border-gray-50 last:border-0 rounded-xl px-2 -mx-2 transition-all cursor-pointer ${
                  selectedId === a.id ? "bg-gray-50" : "hover:bg-gray-50/60"
                }`}>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-bold ${selectedId===a.id?"text-gray-900":"text-gray-400"}`}>#{a.rank}</span>
                  <span className={`text-sm line-clamp-1 ${selectedId===a.id?"text-gray-900 font-medium":"text-gray-600"}`}>{a.name}</span>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <Stars n={a.rating}/>
                  <p className="text-xs text-gray-400 mt-0.5">{a.views}</p>
                </div>
              </Link>
            ))}
            {topArticles.length === 0 && (
              <p className="text-sm text-gray-400 py-8 text-center">Published articles will appear here.</p>
            )}
            {selected && (
              <div className="mt-3 pt-3 border-t border-gray-50">
                <Link href={`/articles/${selected.slug}?own=1`}
                  className="text-xs text-gray-500 hover:text-gray-900 transition-colors">
                  Open article →
                </Link>
              </div>
            )}
          </div>

          {/* Traffic panel */}
          <div className="lg:col-span-3 bg-[#1A1A1A] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-1">
              <p className="text-white text-sm font-semibold">Traffic</p>
            </div>
            <p className="text-gray-500 text-xs mb-3 truncate">{selected?.name ?? "Publish articles to see traffic"}</p>
            <div className="relative h-40 w-full">
              <svg viewBox="0 0 400 140" className="w-full h-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="trafficGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.12"/>
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                <path d={selected?.path ?? TRAFFIC_PATHS[0]} stroke="#ffffff" strokeWidth="2" fill="none"/>
                <path d={`${selected?.path ?? TRAFFIC_PATHS[0]} L400,140 L0,140 Z`} fill="url(#trafficGrad)"/>
                {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d,i) => (
                  <text key={d} x={i*57+8} y="135" fill="#6b7280" fontSize="9">{d}</text>
                ))}
              </svg>
            </div>
          </div>
        </div>

        {/* Reader Feedback */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 mb-4">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Reader Feedback</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Name","Date","Quality","Feedback","Article"].map(h=>(
                    <th key={h} className="text-xs text-gray-400 font-medium pb-3 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {feedbackRows.map(r => (
                  <tr key={r.id} className="border-b border-gray-50 last:border-0">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{r.author_name[0]}</div>
                        <span className="text-sm text-gray-700 font-medium">{r.author_name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-sm text-gray-500">{formatArticleDate(r.created_at)}</td>
                    <td className="py-3"><Stars n={r.quality_rating ?? 5}/></td>
                    <td className="py-3 text-sm text-gray-500">{r.body}</td>
                    <td className="py-3 text-sm text-gray-500">{r.article_title}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {feedbackRows.length === 0 && (
              <p className="text-center text-gray-400 text-sm py-8">Reader comments will appear here.</p>
            )}
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
