"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

type Role = "Writer" | "Reader" | "Subject Expert" | "Client";
const ROLES: Role[] = ["Writer", "Reader", "Subject Expert", "Client"];

const inp = "w-full border-b border-gray-300 bg-transparent outline-none focus:border-black py-2 text-sm text-gray-900 placeholder:text-gray-400 transition-colors";

function Inner() {
  const router = useRouter();
  const sp = useSearchParams();
  const role = (sp.get("role") as Role) || "Writer";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try { localStorage.setItem("sd_role", role); } catch (_) {}
    await new Promise(r => setTimeout(r, 400));
    setLoading(false);
    router.push(`/signup/otp?role=${encodeURIComponent(role)}&email=${encodeURIComponent(email)}`);
  };

  return (
    <div className="flex min-h-screen">
      {/* Left pane */}
      <aside className="hidden md:flex flex-col fixed top-0 left-0 h-screen w-[42%] bg-black text-white px-10 py-10 z-10 select-none">
        <div className="mb-auto">
          <span className="text-2xl font-bold">Logo</span>
        </div>
        <div className="flex flex-col justify-center flex-1">
          <p className="text-lg mb-6 leading-snug">Present <strong className="font-bold">yourself</strong> as...</p>
          <div className="flex flex-col gap-3">
            {ROLES.map(r => (
              <button key={r} onClick={() => router.push(`/signup?role=${encodeURIComponent(r)}`)}
                className={`w-full py-3 px-6 rounded-lg border text-sm font-medium transition-all cursor-pointer text-left ${
                  role === r ? "bg-white text-black border-white" : "bg-transparent text-white border-white/50 hover:bg-white/10"
                }`}>{r}</button>
            ))}
          </div>
          <p className="text-xs text-gray-400 text-center mt-5 leading-relaxed">
            For your personalized Dashboard<br />choose from the above.
          </p>
        </div>
        <div className="text-center mt-auto">
          <p className="text-xl font-bold underline underline-offset-4">Stick&amp;Dot.</p>
        </div>
      </aside>

      {/* Right pane */}
      <main className="w-full md:ml-[42%] md:w-[58%] min-h-screen bg-white overflow-y-auto">
        <header className="flex justify-end items-center gap-8 px-10 py-5">
          <Link href="#" className="text-sm text-gray-500 hover:text-black">Community</Link>
          <Link href="#" className="text-sm text-gray-500 hover:text-black">About</Link>
        </header>
        <nav className="px-10 mb-4">
          <p className="text-sm text-gray-400">Signup&gt;<span className="text-gray-700">{role}</span></p>
        </nav>
        <div className="flex justify-center px-6 pb-16">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-md px-10 py-10">
            <p className="text-xs text-gray-400 mb-1">Step 1 of 3</p>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Create an Account</h1>

            {/* OAuth */}
            <div className="flex gap-4 mb-6">
              {[
                { label: "Apple", icon: "🍎" },
                { label: "Google", icon: "G" },
                { label: "Facebook", icon: "f" },
              ].map(({ label, icon }) => (
                <button key={label}
                  className="flex-1 py-3 border border-gray-200 rounded-xl flex items-center justify-center text-sm font-semibold hover:bg-gray-50 cursor-pointer transition-colors">
                  {icon}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400">or</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <p className="text-sm font-semibold text-gray-800 mb-1">Sign up with Email</p>
            <p className="text-sm text-gray-500 mb-5">
              Already have an account?{" "}
              <Link href="/signup" className="text-black font-semibold hover:underline">Sign in</Link>
            </p>

            <form onSubmit={handleContinue} className="flex flex-col gap-6">
              <div>
                <label className="block text-sm text-gray-500 mb-2">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com" className={inp} required />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-2">Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 6 characters" className={inp} />
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-4 rounded-xl bg-[#111] text-white text-sm font-semibold hover:bg-[#333] disabled:opacity-50 transition-all cursor-pointer mt-2">
                {loading ? "Loading…" : "Continue"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function SignupPage() { return <Suspense><Inner /></Suspense>; }
