"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";
import { type RawRole, RAW_ROLES, dashRootPath } from "@/lib/roles";

const inp = "w-full border-b border-gray-300 bg-transparent outline-none focus:border-black py-2 text-sm text-gray-900 placeholder:text-gray-400 transition-colors";

function Inner() {
  const router = useRouter();
  const sp = useSearchParams();
  const [role, setRole] = useState<RawRole>((sp.get("role") as RawRole) || "Writer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setError("");
    setLoading(true);
    try { localStorage.setItem("sd_role", role); } catch (_) {}
    await new Promise(r => setTimeout(r, 500));
    setLoading(false);
    router.push(dashRootPath(role));
  };

  return (
    <div className="flex min-h-screen">
      {/* Left pane */}
      <aside className="hidden md:flex flex-col fixed top-0 left-0 h-screen w-[42%] bg-black text-white px-10 py-10 z-10 select-none">
        <div className="mb-auto">
          <Logo size="lg" theme="dark" />
        </div>
        <div className="flex flex-col justify-center flex-1">
          <p className="text-lg mb-6 leading-snug">Sign in as a <strong className="font-bold">…</strong></p>
          <div className="flex flex-col gap-3">
            {RAW_ROLES.map(r => (
              <button key={r} onClick={() => setRole(r)}
                className={`w-full py-3 px-6 rounded-lg border text-sm font-medium transition-all cursor-pointer text-left ${
                  role === r ? "bg-white text-black border-white" : "bg-transparent text-white border-white/50 hover:bg-white/10"
                }`}>{r}</button>
            ))}
          </div>
          <p className="text-xs text-gray-400 text-center mt-5 leading-relaxed">
            Select your role to sign in<br />to your personalized dashboard.
          </p>
        </div>
        <div className="mt-auto">
          <Logo size="sm" theme="dark" />
        </div>
      </aside>

      {/* Right pane */}
      <main className="w-full md:ml-[42%] md:w-[58%] min-h-screen bg-white overflow-y-auto">
        <header className="flex justify-end items-center gap-8 px-10 py-5">
          <Link href="/community" className="text-sm text-gray-500 hover:text-black">Community</Link>
          <Link href="/about" className="text-sm text-gray-500 hover:text-black">About</Link>
        </header>
        <nav className="px-10 mb-4">
          <p className="text-sm text-gray-400">Login&gt;<span className="text-gray-700">{role}</span></p>
        </nav>
        <div className="flex justify-center px-6 pb-16">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-md px-10 py-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
            <p className="text-sm text-gray-500 mb-8">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-black font-semibold hover:underline">Sign up</Link>
            </p>
            <div className="flex gap-4 mb-6">
              {[{ label: "Apple", icon: "🍎" }, { label: "Google", icon: "G" }, { label: "Facebook", icon: "f" }].map(({ label, icon }) => (
                <button key={label} aria-label={label}
                  className="flex-1 py-3 border border-gray-200 rounded-xl flex items-center justify-center text-sm font-semibold hover:bg-gray-50 cursor-pointer transition-colors">
                  {icon}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400">or</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div>
                <label className="block text-sm text-gray-500 mb-2">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com" className={inp} required />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-2">Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Your password" className={inp} required />
                <div className="text-right mt-1">
                  <button type="button" className="text-xs text-gray-400 hover:text-black transition-colors cursor-pointer">
                    Forgot password?
                  </button>
                </div>
              </div>
              {error && <p className="text-xs text-red-500">{error}</p>}
              <button type="submit" disabled={loading}
                className="w-full py-4 rounded-xl bg-[#111] text-white text-sm font-semibold hover:bg-[#333] disabled:opacity-50 transition-all cursor-pointer mt-1">
                {loading ? "Signing in…" : "Sign In"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function LoginPage() { return <Suspense><Inner /></Suspense>; }
