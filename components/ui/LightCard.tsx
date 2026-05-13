"use client";
import Link from "next/link";

interface LightCardProps {
  size?: "sm" | "lg";
  title: string;
  author: string;
  tags: string[];
  readTime: string;
  href?: string;
  accent?: string; // kept for API compatibility — no longer used
}

export default function LightCard({
  size = "sm",
  title,
  author,
  tags,
  readTime,
  href = "#",
}: LightCardProps) {
  const isLg = size === "lg";

  return (
    <Link
      href={href}
      className={`group block bg-white border border-[#e5e7eb] rounded-[12px] overflow-hidden
                 shadow-[0_1px_3px_rgba(0,0,0,0.06)]
                 hover:shadow-[0_4px_12px_rgba(0,0,0,0.10)] hover:-translate-y-0.5
                 transition-all duration-200 flex flex-col ${isLg ? "min-h-[220px]" : "min-h-[160px]"}`}
    >
      {/* Tag banner — solid off-white, no gradient */}
      <div
        className={`bg-[#fafafa] border-b border-[#e5e7eb] w-full flex items-end px-4 pb-3 flex-shrink-0 ${
          isLg ? "h-[80px]" : "h-[56px]"
        }`}
      >
        <span className="bg-[#0a0a0a] text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
          {tags[0] ?? "#article"}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <p
          className={`font-bold text-[#0a0a0a] leading-snug line-clamp-2 group-hover:text-[#374151] transition-colors flex-1 ${
            isLg ? "text-base" : "text-sm"
          }`}
        >
          {title}
        </p>

        {isLg && tags.slice(1).length > 0 && (
          <div className="flex gap-1.5 flex-wrap">
            {tags.slice(1).map(t => (
              <span
                key={t}
                className="text-[10px] bg-[#f3f4f6] text-[#6b7280] px-2 py-0.5 rounded-full"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-[#f3f4f6] mt-auto">
          <span className="text-xs text-[#6b7280]">{author}</span>
          <span className="text-xs text-[#9ca3af]">{readTime}</span>
        </div>
      </div>
    </Link>
  );
}