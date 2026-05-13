"use client";
import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { dashRootPath } from "@/lib/roles";

const REVIEWS = [
  {
    id: "1",
    title: "The Future of Neural Computing",
    author: "Aryan Mehta",
    domain: "Technology",
    tags: ["#AI", "#technology"],
    reviewedOn: "2024-01-15",
    score: 91,
    decision: "Approved",
    summary: "Well-researched piece with strong citations and clear structure.",
  },
  {
    id: "2",
    title: "Quantum Entanglement Explained",
    author: "Priya Nair",
    domain: "Science",
    tags: ["#physics", "#science"],
    reviewedOn: "2024-01-22",
    score: 63,
    decision: "Needs Revision",
    summary: "Core concepts are sound but explanations need simplification for general audience.",
  },
  {
    id: "3",
    title: "Blockchain in Supply Chain",
    author: "Rohan Das",
    domain: "Technology",
    tags: ["#blockchain", "#technology"],
    reviewedOn: "2024-02-03",
    score: 42,
    decision: "Rejected",
    summary: "Significant factual inaccuracies in sections 2 and 4. Needs substantial rewrite.",
  },
  {
    id: "4",
    title: "Climate Models and Prediction",
    author: "Sneha Kulkarni",
    domain: "Science",
    tags: ["#climate", "#science"],
    reviewedOn: "2024-02-11",
    score: 88,
    decision: "Approved",
    summary: "Excellent use of recent data. Methodology section is particularly strong.",
  },
  {
    id: "5",
    title: "Machine Learning in Healthcare",
    author: "Vikram Joshi",
    domain: "Technology",
    tags: ["#ML", "#healthcare"],
    reviewedOn: "2024-02-19",
    score: 74,
    decision: "Needs Revision",
    summary: "Good foundation but requires updated references and stronger conclusion.",
  },
  {
    id: "6",
    title: "Dark Matter: Current Theories",
    author: "Ananya Singh",
    domain: "Science",
    tags: ["#physics", "#science"],
    reviewedOn: "2024-03-01",
    score: 95,
    decision: "Approved",
    summary: "Outstanding work. One of the clearest explanations of dark matter candidates reviewed.",
  },
];

const CARDS_PER_LOAD = 6;

function formatDate(d: string): string {
  const [year, month, day] = d.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function cardBorder(decision: string): string {
  if (decision === "Approved")       return "border-[#16a34a]";
  if (decision === "Rejected")       return "border-[#dc2626]";
  return "border-[#e5e7eb]";
}

export default function SMEPortfolioPage() {
  const [visibleCount, setVisibleCount] = useState(CARDS_PER_LOAD);

  const visible  = REVIEWS.slice(0, visibleCount);
  const hasMore  = visibleCount < REVIEWS.length;

  const statsTotal         = REVIEWS.length;
  const statsApproved      = REVIEWS.filter(r => r.decision === "Approved").length;
  const statsRejected      = REVIEWS.filter(r => r.decision === "Rejected").length;
  const statsNeedsRevision = REVIEWS.filter(r => r.decision === "Needs Revision").length;

  return (
    <AppLayout bg="bg-white">
      <div className="min-h-screen px-6 md:px-10 py-10">

        {/* Header */}
        <div className="mb-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1 mb-1" aria-label="Breadcrumb">
            <Link
              href={dashRootPath("Subject Expert")}
              className="text-xs text-[#6b7280] hover:text-[#0a0a0a] transition-colors"
            >
              Dashboard
            </Link>
            <ChevronRight size={16} className="text-[#9ca3af]" />
            <span className="text-xs text-[#0a0a0a] font-medium">Portfolio</span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-bold text-[#0a0a0a]">My Portfolio</h1>
          <p className="text-sm text-[#6b7280] mt-1">Your review history and decisions</p>
        </div>

        {/* Stats bar */}
        <div className="flex border border-[#e5e7eb] rounded-[10px] bg-white mb-7">
          <div className="flex flex-col px-6 py-4 flex-1">
            <span className="text-[20px] font-semibold text-[#0a0a0a]">{statsTotal}</span>
            <span className="text-[13px] text-[#6b7280]">Total Reviews</span>
          </div>
          <div className="flex flex-col px-6 py-4 flex-1 border-l border-[#e5e7eb]">
            <span className="text-[20px] font-semibold text-[#0a0a0a]">{statsApproved}</span>
            <span className="text-[13px] text-[#6b7280]">Approved</span>
          </div>
          <div className="flex flex-col px-6 py-4 flex-1 border-l border-[#e5e7eb]">
            <span className="text-[20px] font-semibold text-[#0a0a0a]">{statsRejected}</span>
            <span className="text-[13px] text-[#6b7280]">Rejected</span>
          </div>
          <div className="flex flex-col px-6 py-4 flex-1 border-l border-[#e5e7eb]">
            <span className="text-[20px] font-semibold text-[#0a0a0a]">{statsNeedsRevision}</span>
            <span className="text-[13px] text-[#6b7280]">Needs Revision</span>
          </div>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {visible.map(r => (
            <div
              key={r.id}
              className={`relative bg-white border rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.06)]
                           hover:shadow-[0_4px_12px_rgba(0,0,0,0.10)] hover:-translate-y-0.5
                           transition-all duration-200 flex flex-col overflow-hidden min-h-[220px]
                           ${cardBorder(r.decision)}`}
            >
              {/* Decision badge — always top-right, always black */}
              <span className="absolute top-3 right-3 z-10 text-[11px] font-semibold px-[10px] py-[3px] rounded-[20px] bg-[#0a0a0a] text-white">
                {r.decision}
              </span>

              {/* Tag banner */}
              <div className="bg-[#fafafa] border-b border-[#e5e7eb] h-[72px] flex items-end px-4 pb-3 flex-shrink-0">
                <span className="bg-[#0a0a0a] text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
                  {r.tags[0] ?? r.domain}
                </span>
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col gap-2 flex-1">
                {/* Title */}
                <p className="text-sm font-bold text-[#0a0a0a] line-clamp-2 flex-1">
                  {r.title}
                </p>

                {/* Author + domain */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs text-[#6b7280]">{r.author}</span>
                  <span className="text-[10px] bg-[#f3f4f6] text-[#374151] px-2 py-0.5 rounded-full">
                    {r.domain}
                  </span>
                </div>

                {/* Reviewed date + score */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#6b7280]">{formatDate(r.reviewedOn)}</span>
                  <span className="text-xs text-[#6b7280]">Score: {r.score}/100</span>
                </div>

                {/* Summary — 1 line clamp */}
                <p className="text-xs text-[#6b7280] line-clamp-1 pt-2 border-t border-[#f3f4f6] mt-auto">
                  {r.summary}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        {hasMore && (
          <button
            onClick={() => setVisibleCount(c => c + CARDS_PER_LOAD)}
            className="w-full border border-[#e5e7eb] rounded-[8px] bg-white text-[#0a0a0a] text-sm font-medium py-3 hover:bg-[#f9fafb] transition-colors cursor-pointer"
          >
            Load more reviews
          </button>
        )}

      </div>
    </AppLayout>
  );
}