"use client";

import { useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Role = "Writer" | "Reader" | "Subject Expert" | "Client";
const ROLES: Role[] = ["Writer", "Reader", "Subject Expert", "Client"];
const GENDERS = ["Male", "Female", "Non-binary", "Prefer not to say"];

function roleToDashboardPath(role: Role): string {
  switch (role) {
    case "Writer":         return "/dashboard/writer";
    case "Reader":         return "/dashboard/reader";
    case "Subject Expert": return "/dashboard/subject-expert";
    case "Client":         return "/dashboard/business";
    default:               return "/dashboard/writer";
  }
}

const inputCls =
  "w-full border-b border-gray-300 bg-transparent outline-none focus:border-black py-2 text-sm text-gray-900 transition-colors caret-black placeholder:text-gray-400";

function DetailsInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = (searchParams.get("role") as Role) || "Writer";
  const email = searchParams.get("email") || "";

  const [selectedRole, setSelectedRole] = useState<Role>(initialRole);
  const [form, setForm] = useState({ name: "", mobile: "", domain: "", gender: "", dob: "" });
  const [isLoading, setIsLoading] = useState(false);
  const dobRef = useRef<HTMLInputElement>(null);

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleRoleSwitch = (role: Role) => {
    // Re-start signup with new role (go back to step 1)
    router.push(`/signup?role=${encodeURIComponent(role)}`);
  };

  const persistAndGo = (name: string, role: Role) => {
    // TODO: POST /api/auth/profile { name, mobile, domain, gender, dob, role }
    // Persist to localStorage so dashboards can read it immediately
    try {
      localStorage.setItem("sd_user_role", role);
      if (name) localStorage.setItem("sd_user_name", name);
      if (email) localStorage.setItem("sd_user_email", email);
    } catch (_) {/* SSR guard */}
    router.push(roleToDashboardPath(role));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 600));
    setIsLoading(false);
    persistAndGo(form.name, selectedRole);
  };

  const handleSkip = () => persistAndGo("", selectedRole);

  return (
    <div className="flex min-h-screen">
      {/* ── Left Pane ── */}
      <aside className="hidden md:flex flex-col fixed top-0 left-0 h-screen w-[40%] bg-black text-white px-10 py-10 z-10">
        <div className="mb-auto">
          <span className="text-2xl font-bold tracking-tight">Logo</span>
        </div>
        <div className="flex flex-col justify-center flex-1 mt-8">
          <p className="text-lg mb-6 leading-snug">
            Present <strong className="font-bold">yourself</strong> as...
          </p>
          <div className="flex flex-col gap-3">
            {ROLES.map((role) => (
              <button
                key={role}
                onClick={() => handleRoleSwitch(role)}
                className={`w-full py-3 px-6 rounded-lg border border-white/70 text-sm font-medium transition-all duration-200 cursor-pointer text-left ${
                  selectedRole === role
                    ? "bg-white text-black border-white"
                    : "bg-transparent text-white hover:bg-white/10"
                }`}
              >
                {role}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 text-center mt-5 leading-relaxed">
            For your personalized Dashboard
            <br />
            choose from the above.
          </p>
        </div>
        <div className="text-center mt-auto">
          <p className="text-sm text-gray-300 mb-1">Humane than AI, faster than human</p>
          <p className="text-xl font-bold underline underline-offset-4 decoration-white">
            Stick&amp;Dot.
          </p>
        </div>
      </aside>

      {/* ── Right Pane ── */}
      <main className="w-full md:ml-[40%] md:w-[60%] min-h-screen bg-[#FAFBFC] overflow-y-auto">
        <header className="flex justify-between items-center px-10 py-5">
          <p className="text-sm text-gray-500">Step 3 of 3</p>
          <button
            onClick={handleSkip}
            className="text-sm text-gray-500 hover:text-black transition-colors"
          >
            Skip
          </button>
        </header>
        <nav className="px-10 mb-6">
          <p className="text-sm text-gray-500">
            Signup &gt; {selectedRole} &gt;{" "}
            <span className="text-gray-700 font-medium">Details</span>
          </p>
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
                <input type="tel" value={form.mobile} onChange={set("mobile")} className={inputCls} placeholder="+91 00000 00000" />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-2">Domain</label>
                <input type="text" value={form.domain} onChange={set("domain")} className={inputCls} placeholder="e.g. Technology, Finance…" />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-2">Gender</label>
                <select value={form.gender} onChange={set("gender")} className={`${inputCls} cursor-pointer`}>
                  <option value="">Select</option>
                  {GENDERS.map((g) => <option key={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-2">Date of Birth</label>
                <input ref={dobRef} type="date" value={form.dob} onChange={set("dob")} className={inputCls} />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-lg bg-[#111111] text-white text-sm font-semibold hover:bg-[#2a2a2a] disabled:opacity-60 transition-all cursor-pointer mt-2"
              >
                {isLoading ? "Saving…" : `Go to ${selectedRole} Dashboard →`}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function DetailsPage() {
  return (
    <Suspense>
      <DetailsInner />
    </Suspense>
  );
}
