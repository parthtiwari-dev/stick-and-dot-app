"use client";
import { useEffect, useState } from "react";
import AppLayout from "@/components/AppLayout";
import Link from "next/link";
import { useUser } from "@/components/UserContext";
import { TrendingUp } from "lucide-react";
import { formatArticleDate, listMyReviews, listReviewQueueArticles, type ReviewHistoryRow } from "@/lib/supabase/articles";

type QueueRow = { id:string; slug:string; title:string; domain:string; writer:string; submitted:string; urgency:string };

const urgencyBadge = (u: string) =>
  u === "high"   ? "bg-red-50 text-red-500 border border-red-100" :
  u === "medium" ? "bg-orange-50 text-orange-500 border border-orange-100" :
                   "bg-gray-100 text-gray-500";

export default function SubjectExpertDashboard() {
  const { userName } = useUser();
  const [queue, setQueue] = useState<QueueRow[]>([]);
  const [recent, setRecent] = useState<ReviewHistoryRow[]>([]);

  useEffect(() => {
    let alive = true;
    Promise.all([listReviewQueueArticles(), listMyReviews(6)])
      .then(([queueRows, reviewRows]) => {
        if (!alive) return;
        setQueue(queueRows
          .filter(row => row.status !== "published")
          .slice(0, 5)
          .map(row => ({
            id: row.id.slice(0, 8).toUpperCase(),
            slug: row.slug,
            title: row.title,
            domain: row.domain_name,
            writer: row.author_name,
            submitted: formatArticleDate(row.submitted_at ?? row.updated_at),
            urgency: row.status === "submitted" ? "high" : row.status === "revision_requested" ? "medium" : "low",
          })));
        setRecent(reviewRows);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const approved = recent.filter(row => row.decision === "approved").length;
  const avgScore = recent.length
    ? (recent.reduce((sum, row) => sum + row.average_score, 0) / recent.length).toFixed(1)
    : "0.0";

  return (
    <AppLayout bg="bg-[#F4F4F4]">
      <div className="p-4 md:p-6 min-h-screen">

        {/* Header — search removed per plan */}
        <div className="mb-5">
          <p className="text-xs text-gray-400 mb-0.5">Dashboard&gt;Expert</p>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Welcome, {userName}</h1>
          <p className="text-sm text-gray-500">Your Review Activity</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
          {[
            { label:"Reviews Done",       value:String(recent.length), icon:"✅", change:`${approved} approved`, up:true },
            { label:"Avg Accuracy Score", value:`${avgScore} / 5`, icon:"🎯", change:"From submitted reviews", up:true },
            { label:"Payment Received",   value:"Metadata only", icon:"🪙", change:"Gateway later", up:true },
          ].map(({ label, value, icon, change, up }) => (
            <div key={label} className="bg-[#1A1A1A] rounded-2xl p-5 text-white flex items-center gap-4">
              <div className="text-3xl">{icon}</div>
              <div>
                <p className="text-xs text-gray-400 mb-1">{label}</p>
                <p className="text-2xl font-bold">{value}</p>
                <p className={`text-xs mt-1 flex items-center gap-1 ${up?"text-green-400":"text-red-400"}`}>
                  <TrendingUp size={11}/> {change}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* My Review Queue */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 mb-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-semibold text-gray-900 text-sm">📋 My Review Queue</p>
              <p className="text-xs text-gray-400 mt-0.5">Articles you have voluntarily picked up to review</p>
            </div>
            <Link href="/dashboard/subject-expert/explore"
              className="bg-[#111] text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-[#333] transition-colors cursor-pointer">
              Find Articles to Review
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Article","Domain","Writer","Date Picked Up","Urgency","Action"].map(h => (
                    <th key={h} className="text-xs text-gray-400 font-medium pb-3 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {queue.map(a => (
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
                      <Link href={`/articles/${a.slug}`} className="text-xs text-gray-500 hover:text-gray-900 underline cursor-pointer transition-colors">
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {queue.length === 0 && (
              <p className="text-center text-gray-400 text-sm py-8">No pending articles in your domains.</p>
            )}
          </div>
        </div>

        {/* Recent Decisions */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <p className="font-semibold text-gray-900 text-sm mb-4">📝 Recent Decisions</p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px]">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Article","Decision","Accuracy Score","Date"].map(h => (
                    <th key={h} className="text-xs text-gray-400 font-medium pb-3 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent.map(r => (
                  <tr key={r.id} className="border-b border-gray-50 last:border-0">
                    <td className="py-3">
                      <p className="text-sm text-gray-800 font-medium">{r.article_title}</p>
                      <p className="text-xs text-gray-400">{r.article_id.slice(0, 8).toUpperCase()}</p>
                    </td>
                    <td className="py-3">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        r.decision === "approved"
                          ? "bg-green-50 text-green-600 border border-green-100"
                          : "bg-orange-50 text-orange-500 border border-orange-100"
                      }`}>
                        {r.decision === "approved" ? "Approved" : "Revision Requested"}
                      </span>
                    </td>
                    <td className="py-3 text-sm text-gray-700 font-semibold">{r.average_score.toFixed(1)} / 5</td>
                    <td className="py-3 text-xs text-gray-500">{formatArticleDate(r.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {recent.length === 0 && (
              <p className="text-center text-gray-400 text-sm py-8">Submitted reviews will appear here.</p>
            )}
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
