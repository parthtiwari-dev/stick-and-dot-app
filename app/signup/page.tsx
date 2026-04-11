"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

type Role = "Writer" | "Reader" | "Subject Expert" | "Client";

const inp = "w-full border-b border-gray-300 bg-transparent outline-none focus:border-black py-2 text-sm text-gray-900 placeholder:text-gray-400 transition-colors";

function Inner() {
  const router = useRouter();
  const sp = useSearchParams();
  const [role, setRole] = useState<Role>((sp.get("role") as Role) || "Writer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // Keep role in sync with URL
  const handleRoleChange = (r: Role) => {
    setRole(r);
    window.history.replaceState(null, "", `/signup?role=${encodeURIComponent(r)}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return setErr("Please enter your email.");
    if (password.length < 6) return setErr("Password must be at least 6 characters.");
    setErr(""); setLoading(true);
    // TODO: POST /api/auth/signup { email, password, role }
    await new Promise(r => setTimeout(r, 600));
    setLoading(false);
    router.push(`/signup/otp?role=${encodeURIComponent(role)}&email=${encodeURIComponent(email)}`);
  };

  return (
    <div className="flex min-h-screen">
      {/* Left — override handleRole to also update local state */}
      <aside className="hidden md:flex flex-col fixed top-0 left-0 h-screen w-[40%] bg-black text-white px-10 py-10 z-10 select-none">
        <div className="mb-auto"><span className="text-2xl font-bold">Logo</span></div>
        <div className="flex flex-col justify-center flex-1">
          <p className="text-base mb-5">Present <strong>yourself</strong> as...</p>
          <div className="flex flex-col gap-3">
            {(["Writer","Reader","Subject Expert","Client"] as Role[]).map(r => (
              <button key={r} onClick={() => handleRoleChange(r)}
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

      {/* Right */}
      <main className="w-full md:ml-[40%] md:w-[60%] min-h-screen bg-[#FAFBFC] overflow-y-auto">
        <header className="flex justify-end items-center gap-8 px-10 py-5">
          <Link href="/community" className="text-sm text-gray-500 hover:text-black transition-colors">Community</Link>
          <Link href="/about" className="text-sm text-gray-500 hover:text-black transition-colors">About</Link>
        </header>
        <nav className="px-10 mb-4">
          <p className="text-sm text-gray-400">Signup&gt;<span className="text-gray-600 font-medium">{role}</span></p>
        </nav>
        <div className="flex justify-center px-6 pb-16">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-md px-10 py-10">
            <p className="text-xs text-gray-400 mb-1">Step 1 of 3</p>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Create an Account</h1>

            {/* Social */}
            <div className="flex gap-3 mb-6">
              {[
                { label: "Apple", icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.4c1.27.07 2.15.75 2.88.8.93-.1 1.81-.82 3.02-.88 2.67-.14 4.66 1.8 4.74 4.64-3.05 1.15-3.53 4.9-.64 6.32zm-3.4-13.14c-.2 1.97-2.07 3.64-4.07 3.52-.2-1.91 1.72-3.7 4.07-3.52z"/></svg> },
                { label: "Google", icon: <svg viewBox="0 0 24 24" width="20" height="20"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg> },
                { label: "Facebook", icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },
              ].map(s => (
                <button key={s.label} type="button" aria-label={`Sign up with ${s.label}`}
                  className="flex-1 flex items-center justify-center border border-gray-200 rounded-2xl py-3 hover:bg-gray-50 transition-colors cursor-pointer">
                  {s.icon}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-gray-200"/><span className="text-xs text-gray-400">or</span><div className="flex-1 h-px bg-gray-200"/>
            </div>

            <p className="text-sm font-semibold text-gray-800 mb-0.5">Sign up with Email</p>
            <p className="text-sm text-gray-500 mb-6">Already have an account? <Link href="/login" className="text-blue-500 hover:underline">Sign in</Link></p>

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
              <div>
                <label className="block text-sm text-gray-500 mb-2">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className={inp} placeholder="you@example.com" autoComplete="email"/>
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-2">Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} className={inp} placeholder="Min. 6 characters" autoComplete="new-password"/>
              </div>
              {err && <p className="text-red-500 text-xs -mt-3">{err}</p>}
              <button type="submit" disabled={loading}
                className="w-full py-4 rounded-xl bg-[#111] text-white text-sm font-semibold hover:bg-[#333] disabled:opacity-50 transition-all cursor-pointer">
                {loading ? "Creating account…" : "Continue"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function SignupPage() { return <Suspense><Inner /></Suspense>; }
