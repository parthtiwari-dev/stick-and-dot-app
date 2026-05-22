"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Logo from "@/components/Logo";
import { type RawRole, RAW_ROLES, dashRootPath } from "@/lib/roles";
import { upsertCurrentProfile } from "@/lib/supabase/profile";

const inp = "w-full border-b border-gray-300 bg-transparent outline-none focus:border-black py-2 text-sm text-gray-900 placeholder:text-gray-400 transition-colors";

function Inner() {
  const router = useRouter();
  const sp     = useSearchParams();
  const role   = (sp.get("role") as RawRole) || "Writer";
  const email  = sp.get("email") || "";
  const [form, setForm] = useState({ name:"", mobile:"", domain:"", gender:"", dob:"" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(p => ({ ...p, [k]: e.target.value }));

  // Writer and Subject Expert go to expertise step; Reader and Client go straight to dashboard
  const needsExpertise = role === "Writer" || role === "Subject Expert";

  const go = async (name: string) => {
    await upsertCurrentProfile({
      role,
      email,
      name,
      mobile: form.mobile,
      domain: form.domain,
      gender: form.gender,
      dob: form.dob,
    });

    if (needsExpertise) {
      router.push(
        `/signup/expertise?role=${encodeURIComponent(role)}&name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`
      );
    } else {
      router.push(dashRootPath(role));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await go(form.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <aside className="hidden md:flex flex-col fixed top-0 left-0 h-screen w-[42%] bg-black text-white px-10 py-10 z-10 select-none">
        <div className="mb-auto">
          <Logo size="lg" theme="dark"/>
        </div>
        <div className="flex flex-col justify-center flex-1">
          <p className="text-lg mb-6 leading-snug">Present <strong>yourself</strong> as...</p>
          <div className="flex flex-col gap-3">
            {RAW_ROLES.map(r => (
              <button key={r} onClick={() => router.push(`/signup?role=${encodeURIComponent(r)}`)}
                className={`w-full py-3 px-6 rounded-lg border text-sm font-medium transition-all cursor-pointer text-left ${
                  role === r ? "bg-white text-black border-white" : "bg-transparent text-white border-white/50 hover:bg-white/10"
                }`}>{r}</button>
            ))}
          </div>
          <p className="text-xs text-gray-400 text-center mt-5 leading-relaxed">
            For your personalized Dashboard<br/>choose from the above.
          </p>
        </div>
        <div className="mt-auto">
          <Logo size="sm" theme="dark"/>
        </div>
      </aside>

      <main className="w-full md:ml-[42%] md:w-[58%] min-h-screen bg-white overflow-y-auto">
        <header className="flex justify-end items-center gap-8 px-10 py-5">
          <a href="/about" className="text-sm text-gray-500 hover:text-black">About</a>
        </header>
        <nav className="px-10 mb-4">
          <p className="text-sm text-gray-400">
            Signup&gt;{role}&gt;OTP&gt;<span className="text-gray-700">Details</span>
          </p>
        </nav>
        <div className="flex justify-center px-6 pb-16">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-md px-10 py-10">
            <p className="text-xs text-gray-400 mb-1">
              Step 3 of {needsExpertise ? "4" : "3"}
            </p>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Add Details</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-7">
              <div>
                <label className="block text-sm text-gray-500 mb-2">Name</label>
                <input type="text" value={form.name} onChange={set("name")} className={inp} placeholder="Full name"/>
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-2">Mobile No.</label>
                <input type="tel" value={form.mobile} onChange={set("mobile")} className={inp} placeholder="+91 00000 00000"/>
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-2">Domain of Interest</label>
                <input type="text" value={form.domain} onChange={set("domain")} className={inp} placeholder="e.g. Technology, Finance…"/>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm text-gray-500 mb-2">Gender</label>
                  <select value={form.gender} onChange={set("gender")} className={`${inp} cursor-pointer`}>
                    <option value="">Select</option>
                    {["Male","Female","Non-binary","Prefer not to say"].map(g=><option key={g}>{g}</option>)}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm text-gray-500 mb-2">DOB</label>
                  <input type="date" value={form.dob} onChange={set("dob")} className={inp}/>
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-4 rounded-xl bg-[#111] text-white text-sm font-semibold hover:bg-[#333] disabled:opacity-50 transition-all cursor-pointer">
                {loading ? "Saving…" : needsExpertise ? "Continue →" : "Finish Setup"}
              </button>
              {error && <p className="text-xs text-red-500 -mt-2">{error}</p>}
              <button type="button" onClick={() => { void go("").catch(err => setError(err instanceof Error ? err.message : "Unable to skip.")); }}
                className="text-sm text-gray-500 hover:text-black text-center transition-colors cursor-pointer underline">
                Skip for now
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function DetailsPage() { return <Suspense><Inner/></Suspense>; }
