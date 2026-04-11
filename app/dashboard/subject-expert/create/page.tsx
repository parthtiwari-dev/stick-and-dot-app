"use client";
import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import Link from "next/link";
import { Star, PlusCircle } from "lucide-react";

const DOMAINS = ["Technology","Finance","Medical / Health","Law","Science","Engineering","Education","Business","Other"];

function StarRating({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(i => (
        <button key={i} type="button"
          onClick={() => onChange(i)}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          className="cursor-pointer transition-transform hover:scale-110">
          <Star size={22}
            fill={(hover || value) >= i ? "#F97316" : "none"}
            className={(hover || value) >= i ? "text-[#F97316]" : "text-gray-300"} />
        </button>
      ))}
    </div>
  );
}

export default function SubjectExpertCreateReview() {
  const [articleRef, setArticleRef]   = useState("");
  const [domain, setDomain]           = useState("");
  const [accuracyRating, setAccuracy] = useState(0);
  const [qualityRating, setQuality]   = useState(0);
  const [summary, setSummary]         = useState("");
  const [feedback, setFeedback]       = useState<{ id: number; value: string }[]>([{ id: 1, value: "" }]);
  const [approved, setApproved]       = useState<boolean | null>(null);

  const addFeedback  = () => setFeedback(p => [...p, { id: Date.now(), value: "" }]);
  const updFeedback  = (id: number, v: string) => setFeedback(p => p.map(f => f.id === id ? { ...f, value: v } : f));

  const inp = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-gray-400 bg-white placeholder:text-gray-300 transition-colors";

  return (
    <AppLayout bg="bg-[#F4F4F4]">
      <div className="p-4 md:p-6 max-w-2xl">
        <p className="text-xs text-gray-400 mb-1">
          <Link href="/dashboard/subject-expert" className="hover:text-gray-700">Dashboard</Link>
          &gt;Submit Review
        </p>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Submit a Review</h1>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 flex flex-col gap-5">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Article Reference</label>
            <p className="text-xs text-gray-400 mb-2">Title or ID of the article you are reviewing</p>
            <input type="text" value={articleRef} onChange={e => setArticleRef(e.target.value)}
              placeholder="e.g. The Future of Renewable Energy / #ART-0042" className={inp} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Domain of Expertise</label>
            <p className="text-xs text-gray-400 mb-2">Which domain does this article fall under?</p>
            <select value={domain} onChange={e => setDomain(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-gray-400 bg-white cursor-pointer">
              <option value="">Select a domain…</option>
              {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Factual Accuracy</label>
            <p className="text-xs text-gray-400 mb-2">How accurate is the content?</p>
            <StarRating value={accuracyRating} onChange={setAccuracy} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Writing Quality</label>
            <p className="text-xs text-gray-400 mb-2">Clarity, structure and readability</p>
            <StarRating value={qualityRating} onChange={setQuality} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Review Summary</label>
            <p className="text-xs text-gray-400 mb-2">A brief overall assessment</p>
            <textarea value={summary} onChange={e => setSummary(e.target.value)}
              rows={3} placeholder="Overall the article is well-researched but has minor factual gaps in…"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-gray-400 bg-white placeholder:text-gray-300 transition-colors resize-none" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Detailed Feedback Points</label>
            <p className="text-xs text-gray-400 mb-2">Specific corrections or suggestions</p>
            {feedback.map(f => (
              <input key={f.id} type="text" value={f.value}
                onChange={e => updFeedback(f.id, e.target.value)}
                placeholder="e.g. Section 2 — statistic needs a citation" className={`${inp} mb-2`} />
            ))}
          </div>

          <button onClick={addFeedback}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 cursor-pointer transition-colors w-fit">
            <PlusCircle size={16} />Add more feedback points
          </button>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Approval Decision</label>
            <div className="flex gap-3">
              {[{ label: "Approve", val: true }, { label: "Request Revision", val: false }].map(opt => (
                <button key={String(opt.val)} type="button"
                  onClick={() => setApproved(opt.val)}
                  className={`flex-1 py-3 rounded-xl text-sm font-semibold border transition-all cursor-pointer ${
                    approved === opt.val
                      ? opt.val ? "bg-green-600 text-white border-green-600" : "bg-[#F97316] text-white border-[#F97316]"
                      : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                  }`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <button className="w-full py-4 bg-[#111] text-white rounded-xl text-sm font-semibold hover:bg-[#333] transition-colors cursor-pointer mt-2">
            Submit Review
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
