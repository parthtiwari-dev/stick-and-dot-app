"use client";
import { useEffect, useState } from "react";
import AppLayout from "@/components/AppLayout";
import { BookOpen, PenLine, Briefcase, FlaskConical } from "lucide-react";

type Role = "writer" | "business" | "reader" | "subject-expert";

function storageRole(): Role {
  try {
    const r = localStorage.getItem("sd_role");
    if (r === "Reader") return "reader";
    if (r === "Client") return "business";
    if (r === "Subject Expert") return "subject-expert";
    if (r === "Writer") return "writer";
  } catch (_) {}
  return "reader";
}

const ROLE_RESOURCES: Record<Role, {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  heading: string;
  subtitle: string;
  items: { title: string; desc: string }[];
}> = {
  reader: {
    icon: BookOpen,
    heading: "Reader Resources",
    subtitle: "Curated reading lists, highlights and bookmarks for you.",
    items: [
      { title: "Reading Guides", desc: "Tips to get more from every article you read." },
      { title: "Bookmarks", desc: "Quickly access your saved articles and series." },
      { title: "Genre Explorer", desc: "Discover content by genre that suits your taste." },
      { title: "Understanding Meter", desc: "Track how well you comprehend what you read." },
    ],
  },
  writer: {
    icon: PenLine,
    heading: "Writer Resources",
    subtitle: "Templates, guides and tools to sharpen your craft.",
    items: [
      { title: "Article Templates", desc: "Start faster with professionally structured templates." },
      { title: "Style Guide", desc: "Maintain consistent voice and formatting across articles." },
      { title: "SEO Checklist", desc: "Optimise every post for discovery and engagement." },
      { title: "Writing Analytics", desc: "Understand which articles perform best and why." },
    ],
  },
  business: {
    icon: Briefcase,
    heading: "Business Resources",
    subtitle: "Tools and guides to manage your content operations.",
    items: [
      { title: "Campaign Planner", desc: "Plan and schedule content campaigns effectively." },
      { title: "Writer Directory", desc: "Find and connect with the right writers for your brand." },
      { title: "Task Templates", desc: "Reusable brief templates to assign work quickly." },
      { title: "Analytics Overview", desc: "Measure ROI across all your content investments." },
    ],
  },
  "subject-expert": {
    icon: FlaskConical,
    heading: "Expert Resources",
    subtitle: "Research tools, domain references and review guides.",
    items: [
      { title: "Review Guidelines", desc: "Standards for evaluating and rating submitted work." },
      { title: "Domain Library", desc: "Reference materials organised by your areas of expertise." },
      { title: "Feedback Templates", desc: "Structured templates to give consistent, quality feedback." },
      { title: "Collaboration Hub", desc: "Work alongside writers to refine complex articles." },
    ],
  },
};

export default function Resources() {
  const [role, setRole] = useState<Role>("reader");

  useEffect(() => {
    setRole(storageRole());
  }, []);

  const { icon: Icon, heading, subtitle, items } = ROLE_RESOURCES[role];

  return (
    <AppLayout bg="bg-[#F4F4F4]">
      <div className="min-h-screen p-6 md:p-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#111] flex items-center justify-center flex-shrink-0">
              <Icon size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{heading}</h1>
              <p className="text-gray-500 text-sm">{subtitle}</p>
            </div>
          </div>
        </div>

        {/* Resource Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 max-w-3xl">
          {items.map((item, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-8 h-8 rounded-lg bg-[#F4F4F4] flex items-center justify-center mb-3">
                <Icon size={16} className="text-gray-700" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              <button className="mt-4 text-xs font-semibold text-gray-700 hover:text-black transition-colors">
                Explore →
              </button>
            </div>
          ))}
        </div>

        {/* Coming soon banner */}
        <div className="mt-8 bg-[#111] text-white rounded-2xl p-6 max-w-3xl flex items-center justify-between">
          <div>
            <p className="font-semibold mb-1">More resources coming soon</p>
            <p className="text-gray-400 text-sm">We&apos;re building a richer library for you.</p>
          </div>
          <span className="text-2xl">🚧</span>
        </div>
      </div>
    </AppLayout>
  );
}
