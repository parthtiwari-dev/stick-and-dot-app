"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

type Role = "Writer" | "Reader" | "Subject Expert" | "Client";
const ROLES: Role[] = ["Writer", "Reader", "Subject Expert", "Client"];

const inputCls =
  "w-full border-b border-gray-300 bg-transparent outline-none focus:border-black py-2 text-sm text-gray-900 transition-colors caret-black placeholder:text-gray-400";

function roleToDashboardPath(role: Role): string {
  switch (role) {
    case "Writer":         return "/dashboard/writer";
    case "Reader":         return "/dashboard/reader";
    case "Subject Expert": return "/dashboard/subject-expert";
    case "Client":         return "/dashboard/business";
    default:               return "/dashboard/writer";
  }
}

function LoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = (searchParams.get("role") as Role) || "Writer";

  const [selectedRole, setSelectedRole] = useState<Role>(initialRole);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    window.history.replaceState(null, "", `/login?role=${encodeURIComponent(role)}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { setError("Please enter your email."); return; }
    if (!password) { setError("Please enter your password."); return; }
    setError("");
    setIsLoading(true);
    // TODO: POST /api/auth/login { email, password, role: selectedRole }
    await new Promise((res) => setTimeout(res, 600));
    setIsLoading(false);
    try {
      localStorage.setItem("sd_user_role", selectedRole);
    } catch (_) {}
    router.push(roleToDashboardPath(selectedRole));
  };

  return (
    <div className="flex min-h-screen">
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
                onClick={() => handleRoleSelect(role)}
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

      <main className="w-full md:ml-[40%] md:w-[60%] min-h-screen bg-[#FAFBFC] overflow-y-auto">
        <header className="flex justify-end items-center gap-6 px-10 py-5">
          <Link href="/community" className="text-sm text-gray-500 hover:text-black transition-colors">Community</Link>
          <Link href="/about" className="text-sm text-gray-500 hover:text-black transition-colors">About</Link>
        </header>

        <nav className="px-10 mb-6">
          <p className="text-sm text-gray-500">
            Login &gt; <span className="text-gray-700 font-medium">{selectedRole}</span>
          </p>
        </nav>

        <div className="flex justify-center px-6 pb-16">
          <div className="bg-white rounded-xl shadow-md w-full max-w-md px-10 py-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Sign In</h1>

            <div className="flex gap-4 mb-6">
              <button type="button" className="flex-1 flex items-center justify-center border border-gray-200 rounded-xl py-3 hover:bg-gray-50 transition-colors cursor-pointer" aria-label="Sign in with Apple">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.4c1.27.07 2.15.75 2.88.8.93-.1 1.81-.82 3.02-.88 2.67-.14 4.66 1.8 4.74 4.64-3.05 1.15-3.53 4.9-.64 6.32zm-3.4-13.14c-.2 1.97-2.07 3.64-4.07 3.52-.2-1.91 1.72-3.7 4.07-3.52z" /></svg>
              </button>
              <button type="button" className="flex-1 flex items-center justify-center border border-gray-200 rounded-xl py-3 hover:bg-gray-50 transition-colors cursor-pointer" aria-label="Sign in with Google">
                <svg viewBox="0 0 24 24" width="20" height="20"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              </button>
              <button type="button" className="flex-1 flex items-center justify-center border border-gray-200 rounded-xl py-3 hover:bg-gray-50 transition-colors cursor-pointer" aria-label="Sign in with Facebook">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </button>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400">or</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <p className="text-sm text-gray-500 mb-6">
              Don&apos;t have an account?{" "}
              <Link href={`/signup?role=${encodeURIComponent(selectedRole)}`} className="text-blue-600 hover:underline font-medium">
                Sign up
              </Link>
            </p>

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
              <div>
                <label className="block text-sm text-gray-500 mb-2">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} placeholder="you@example.com" autoComplete="email" />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-2">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} placeholder="Your password" autoComplete="current-password" />
              </div>
              {error && <p className="text-red-500 text-xs -mt-2">{error}</p>}
              <button type="submit" disabled={isLoading} className="w-full py-4 rounded-lg bg-[#111111] text-white text-sm font-semibold hover:bg-[#2a2a2a] disabled:opacity-60 transition-all cursor-pointer mt-2">
                {isLoading ? "Signing in…" : "Sign In"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return <Suspense><LoginInner /></Suspense>;
}
