"use client";

import { useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Role = "Writer" | "Reader" | "Subject Expert" | "Client";

function roleToDashboardPath(role: Role): string {
  switch (role) {
    case "Writer":         return "/dashboard/writer";
    case "Reader":         return "/dashboard/reader";
    case "Subject Expert": return "/dashboard/subject-expert";
    case "Client":         return "/dashboard/business";
    default:               return "/dashboard/writer";
  }
}

const inputCls = "w-full border-b border-gray-300 bg-transparent outline-none focus:border-black py-2 text-sm text-gray-900 transition-colors caret-black";
const GENDERS = ["Male", "Female", "Non-binary", "Prefer not to say"];

function DetailsInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = (searchParams.get("role") as Role) || "Writer";

  const [form, setForm] = useState({ name: "", mobile: "", domain: "", gender: "", dob: "" });
  const [isLoading, setIsLoading] = useState(false);
  const dobRef = useRef<HTMLInputElement>(null);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 600));
    setIsLoading(false);
    router.push(roleToDashboardPath(role));
  };
  const handleSkip = () => router.push(roleToDashboardPath(role));

  return (
    <div className="flex min-h-screen">
      {/* Left pane */}
      <aside className="hidden md:flex flex-col fixed top-0 left-0 h-screen w-[40%] bg-black text-white px-10 py-10 z-10">
        <div className="mb-auto"><span className="text-2xl font-bold">Logo</span></div>
        <div className="flex flex-col justify-center flex-1 mt-8">
          <p className="text-lg mb-6">Present <strong>yourself</strong> as...</p>
          <div className="flex flex-col gap-3">
            {["Writer","Reader","Subject Expert","Client"].map((r) => (
              <div key={r} className={`w-full py-3 px-6 rounded-lg border border-white/70 text-sm font-medium ${r === role ? "bg-white text-black" : "text-white opacity-40"}`}>{r}</div>
            ))}
          </div>
        </div>
        <div className="text-center mt-auto">
          <p className="text-sm text-gray-300 mb-1">Humane than AI, faster than human</p>
          <p className="text-xl font-bold underline underline-offset-4">Stick&amp;Dot.</p>
        </div>
      </aside>

      {/* Right pane */}
      <main className="w-full md:ml-[40%] md:w-[60%] min-h-screen bg-[#FAFBFC] overflow-y-auto">
        <header className="flex justify-between items-center px-10 py-5">
          <p className="text-sm text-gray-500">Step 3 of 3</p>
          <button onClick={handleSkip} className="text-sm text-gray-500 hover:text-black transition-colors">Skip</button>
        </header>
        <nav className="px-10 mb-6">
          <p className="text-sm text-gray-500">Signup &gt; {role} &gt; <span className="text-gray-700 font-medium">Details</span></p>
        </nav>
        <div className="flex justify-center px-6 pb-16">
          <div className="bg-white rounded-xl shadow-md w-full max-w-md px-10 py-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Add Details</h1>
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-7">
              <div>
                <label className="block text-sm text-gray-500 mb-2">Name</label>
                <input type="text" value={form.name} onChange={set("name")} className={inputCls} placeholder="Full name" />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-2">Mobile Number</label>
                <input type="tel" value={form.mobile} onChange={set("mobile")} className={inputCls} />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-2">Domain</label>
                <input type="text" value={form.domain} onChange={set("domain")} className={inputCls} />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-2">Gender</label>
                <select value={form.gender} onChange={set("gender")} className={`${inputCls} cursor-pointer`}>
                  <option value="">Select</option>
                  {GENDERS.map((g) => <option key={g}>{g}</option>)}
                </select>
              </div>
              <div className="relative">
                <label className="block text-sm text-gray-500 mb-2">Date of Birth</label>
                <input ref={dobRef} type="date" value={form.dob} onChange={set("dob")} className={inputCls} />
              </div>
              <button type="submit" disabled={isLoading}
                className="w-full py-4 rounded-lg bg-[#111111] text-white text-sm font-semibold hover:bg-[#2a2a2a] disabled:opacity-60 transition-all cursor-pointer mt-2">
                {isLoading ? "Saving…" : `Go to ${role} Dashboard →`}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function DetailsPage() {
  return <Suspense><DetailsInner /></Suspense>;
}
