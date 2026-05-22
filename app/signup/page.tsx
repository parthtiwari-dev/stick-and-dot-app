"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";
import { dashRootPath, type RawRole, RAW_ROLES } from "@/lib/roles";
import { createClient } from "@/lib/supabase/client";

const inp = "w-full border-b border-gray-300 bg-transparent outline-none focus:border-black py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition-colors";
type OAuthProvider = "google" | "facebook" | "apple";

function Inner() {
  const router = useRouter();
  const sp     = useSearchParams();
  const role   = (sp.get("role") as RawRole) || "Writer";
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [pwError, setPwError]   = useState("");
  const [loading, setLoading]   = useState(false);

  const handleOAuth = async (provider: OAuthProvider) => {
    setPwError("");
    setLoading(true);
    try {
      const supabase = createClient();
      const redirectTo = `${window.location.origin}/auth/callback?role=${encodeURIComponent(role)}&next=${encodeURIComponent(dashRootPath(role))}`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo },
      });
      if (error) setPwError(error.message);
    } catch (err) {
      setPwError(err instanceof Error ? err.message : "Unable to start social sign in.");
      setLoading(false);
    }
  };

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { setPwError("Password must be at least 6 characters."); return; }
    setPwError("");
    setLoading(true);
    try {
      const supabase = createClient();
      const next = `/signup/details?role=${encodeURIComponent(role)}&email=${encodeURIComponent(email)}`;
      const emailRedirectTo = `${window.location.origin}/auth/callback?role=${encodeURIComponent(role)}&next=${encodeURIComponent(next)}`;
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo,
          data: { role },
        },
      });
      if (error) throw error;
      router.push(`/signup/otp?role=${encodeURIComponent(role)}&email=${encodeURIComponent(email)}`);
    } catch (err) {
      setPwError(err instanceof Error ? err.message : "Unable to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">

      {/* ── Left pane (desktop only) ── */}
      <aside className="hidden md:flex flex-col fixed top-0 left-0 h-screen w-[42%] bg-black text-white px-10 py-10 z-10 select-none">
        <div className="mb-auto"><Logo size="lg" theme="dark"/></div>
        <div className="flex flex-col justify-center flex-1">
          <p className="text-lg mb-6 leading-snug">Present <strong className="font-bold">yourself</strong> as...</p>
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
        <div className="mt-auto"><Logo size="sm" theme="dark"/></div>
      </aside>

      {/* ── Right pane ── */}
      <main className="w-full md:ml-[42%] md:w-[58%] min-h-screen bg-white flex flex-col">

        {/* Mobile header */}
        <div className="md:hidden flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <Logo size="sm" theme="light"/>
          <Link href="/login" className="text-xs text-gray-500 hover:text-black">Sign in</Link>
        </div>

        {/* Mobile: role selector */}
        <div className="md:hidden px-5 py-3">
          <p className="text-xs text-gray-500 mb-2 font-medium">I am a...</p>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {RAW_ROLES.map(r => (
              <button key={r} onClick={() => router.push(`/signup?role=${encodeURIComponent(r)}`)}
                className={`flex-shrink-0 text-xs px-4 py-2 rounded-full border font-medium transition-all cursor-pointer ${
                  role === r ? "bg-black text-white border-black" : "bg-white text-gray-600 border-gray-200"
                }`}>{r}</button>
            ))}
          </div>
        </div>

        {/* Desktop header */}
        <header className="hidden md:flex justify-end items-center gap-8 px-10 py-5">
          <Link href="/about" className="text-sm text-gray-500 hover:text-black">About</Link>
        </header>

        {/* Breadcrumb */}
        <nav className="hidden md:block px-10 mb-2">
          <p className="text-sm text-gray-400">Signup&gt;<span className="text-gray-700">{role}</span></p>
        </nav>

        {/* Form card */}
        <div className="flex-1 flex items-start justify-center px-4 sm:px-6 pb-10 pt-4 md:pt-0 md:pb-16">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-md px-6 sm:px-10 py-8 sm:py-10">
            <p className="text-xs text-gray-400 mb-1">Step 1 of 3</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-7">Create an Account</h1>

            {/* OAuth */}
            <div className="flex gap-3 mb-6">
              {[{label:"Apple",icon:"🍎"},{label:"Google",icon:"G"},{label:"Facebook",icon:"f"}].map(({label,icon}) => (
                <button key={label}
                  type="button"
                  onClick={() => handleOAuth(label.toLowerCase() as OAuthProvider)}
                  className="flex-1 py-3 border border-gray-200 rounded-xl flex items-center justify-center text-sm font-semibold hover:bg-gray-50 cursor-pointer transition-colors">
                  {icon}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-gray-100"/>
              <span className="text-xs text-gray-400">or</span>
              <div className="flex-1 h-px bg-gray-100"/>
            </div>

            <p className="text-sm font-semibold text-gray-800 mb-1">Sign up with Email</p>
            <p className="text-sm text-gray-500 mb-5">
              Already have an account?{" "}
              <Link href="/login" className="text-black font-semibold hover:underline">Sign in</Link>
            </p>

            <form onSubmit={handleContinue} className="flex flex-col gap-6">
              <div>
                <label className="block text-sm text-gray-500 mb-2">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com" className={inp} required/>
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-2">Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 6 characters" className={inp} required/>
                {pwError && <p className="text-xs text-red-500 mt-1.5">{pwError}</p>}
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-4 rounded-xl bg-[#111] text-white text-sm font-semibold hover:bg-[#333] disabled:opacity-50 transition-all cursor-pointer">
                {loading ? "Loading…" : "Continue"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function SignupPage() { return <Suspense><Inner/></Suspense>; }
