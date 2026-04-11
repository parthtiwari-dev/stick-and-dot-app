"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

type Role = "Writer" | "Reader" | "Subject Expert" | "Client";

function dashPath(r: Role) {
  return r === "Reader" ? "/dashboard/reader"
       : r === "Subject Expert" ? "/dashboard/subject-expert"
       : r === "Client" ? "/dashboard/business"
       : "/dashboard/writer";
}

const inp = "w-full border-b border-gray-300 bg-transparent outline-none focus:border-black py-2 text-sm text-gray-900 placeholder:text-gray-400 transition-colors";

function Inner() {
  const router = useRouter();
  const sp = useSearchParams();
  const role = (sp.get("role") as Role) || "Writer";
  const email = sp.get("email") || "";
  const [form, setForm] = useState({ name: "", mobile: "", domain: "", gender: "", dob: "" });
  const [loading, setLoading] = useState(false);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm(p => ({ ...p, [k]: e.target.value }));

  const go = (name: string) => {
    try {
      localStorage.setItem("sd_role", role);
      if (name) localStorage.setItem("sd_name", name);
      if (email) localStorage.setItem("sd_email", email);
    } catch (_) {}
    router.push(dashPath(role));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: POST /api/auth/profile { ...form, role, email }
    await new Promise(r => setTimeout(r, 600));
    setLoading(false);
    go(form.name);
  };

  return (
    <div className="flex min-h-screen">
      <aside className="hidden md:flex flex-col fixed top-0 left-0 h-screen w-[40%] bg-black text-white px-10 py-10 z-10 select-none">
        <div className="mb-auto"><span className="text-2xl font-bold">Logo</span></div>
        <div className="flex flex-col justify-center flex-1">
          <p className="text-base mb-5">Present <strong>yourself</strong> as...</p>
          <div className="flex flex-col gap-3">
            {(["Writer","Reader","Subject Expert","Client"] as Role[]).map(r => (
              <button key={r} onClick={() => router.push(`/signup?role=${encodeURIComponent(r)}`)}
                className={`w-full py-3 px-6 rounded-lg border text-sm font-medium transition-all cursor-pointer text-left ${
                  role === r ? "bg-white text-black border-white" : "bg-transparent text-white border-white/50 hover:bg-white/10"
                }`}>{r}</button>
            ))}
          </div>
          <p className="text-xs text-gray-400 text-center mt-5 leading-relaxed">For your personalized Dashboard<br />choose from the above.</p>
        </div>
        <div className="text-center mt-auto">
          <p className="text-sm text-gray-400 mb-1">Humane than AI, faster than human</p>
          <p className="text-xl font-bold underline underline-offset-4">Stick&amp;Dot.</p>
        </div>
      </aside>

      <main className="w-full md:ml-[40%] md:w-[60%] min-h-screen bg-[#FAFBFC] overflow-y-auto">
        <header className="flex justify-end items-center gap-8 px-10 py-5">
          <Link href="/community" className="text-sm text-gray-500 hover:text-black">Community</Link>
          <Link href="/about" className="text-sm text-gray-500 hover:text-black">About</Link>
        </header>
        <nav className="px-10 mb-4">
          <p className="text-sm text-gray-400">Signup&gt;{role}&gt;OTP&gt;<span className="text-gray-600 font-medium">Details</span></p>
        </nav>
        <div className="flex justify-center px-6 pb-16">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-md px-10 py-10">
            <p className="text-xs text-gray-400 mb-1">Step 3 of 3</p>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Add Details</h1>
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-7">
              <div>
                <label className="block text-sm text-gray-500 mb-2">Name</label>
                <input type="text" value={form.name} onChange={set("name")} className={inp} placeholder="Full name"/>
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-2">Mobile No.</label>
                <input type="tel" value={form.mobile} onChange={set("mobile")} className={inp} placeholder="+91 00000 00000"/>
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-2">Name of Domain</label>
                <input type="text" value={form.domain} onChange={set("domain")} className={inp} placeholder="e.g. Technology, Finance…"/>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm text-gray-500 mb-2">Gender</label>
                  <select value={form.gender} onChange={set("gender")} className={`${inp} cursor-pointer`}>
                    <option value="">Select</option>
                    {["Male","Female","Non-binary","Prefer not to say"].map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm text-gray-500 mb-2">DOB</label>
                  <input type="date" value={form.dob} onChange={set("dob")} className={inp}/>
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-4 rounded-xl bg-[#111] text-white text-sm font-semibold hover:bg-[#333] disabled:opacity-50 transition-all cursor-pointer">
                {loading ? "Saving…" : "Continue"}
              </button>
              <button type="button" onClick={() => go("")} className="text-sm text-gray-500 hover:text-black text-center transition-colors cursor-pointer">
                Skip for now
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function DetailsPage() { return <Suspense><Inner /></Suspense>; }
