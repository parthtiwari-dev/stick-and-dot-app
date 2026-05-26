"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";
import { type RawRole, RAW_ROLES, dashRootPath } from "@/lib/roles";
import { isEnvEnabled } from "@/lib/env";
import { createClient } from "@/lib/supabase/client";
import { getCurrentProfile, upsertCurrentProfile } from "@/lib/supabase/profile";

const inp = "w-full border-b border-gray-300 bg-transparent outline-none focus:border-black py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition-colors";
type OAuthProvider = "google" | "facebook" | "apple";
type DevAccount = { key: string; label: string; role: RawRole; email: string; next: string };

function Inner() {
  const router = useRouter();
  const sp = useSearchParams();
  const [role, setRole]     = useState<RawRole>((sp.get("role") as RawRole) || "Writer");
  const [email, setEmail]   = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [devAccounts, setDevAccounts] = useState<DevAccount[]>([]);

  useEffect(() => {
    const showDevAuth =
      isEnvEnabled(process.env.NEXT_PUBLIC_DEV_AUTH_ENABLED) ||
      isEnvEnabled(process.env.NEXT_PUBLIC_DEMO_AUTH_ENABLED);
    if (!showDevAuth) return;

    fetch("/api/dev-auth/accounts")
      .then(res => res.json())
      .then((data: { enabled?: boolean; accounts?: DevAccount[] }) => {
        if (data.enabled) setDevAccounts(data.accounts ?? []);
      })
      .catch(() => {});
  }, []);

  const handleOAuth = async (provider: OAuthProvider) => {
    setError("");
    setLoading(true);
    try {
      const supabase = createClient();
      const redirectTo = `${window.location.origin}/auth/callback?role=${encodeURIComponent(role)}&next=${encodeURIComponent(dashRootPath(role))}`;
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo },
      });
      if (oauthError) setError(oauthError.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to start social sign in.");
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setError("");
    setLoading(true);
    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;

      const { profile } = await getCurrentProfile();
      const resolvedProfile = profile ?? await upsertCurrentProfile({ role, email });

      if (resolvedProfile.role !== role) {
        await supabase.auth.signOut();
        setError(`This account is registered as ${resolvedProfile.role}. Select that role to sign in.`);
        return;
      }

      router.push(dashRootPath(resolvedProfile.role));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Enter your email first.");
      return;
    }

    setError("");
    try {
      const supabase = createClient();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      });
      if (resetError) throw resetError;
      setError("Password reset email sent.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to send reset email.");
    }
  };

  const handleDevLogin = async (key: string) => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/dev-auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });
      const data = await res.json() as { next?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Unable to use dev login.");
      router.push(data.next ?? "/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to use dev login.");
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
            Select your role to sign in<br/>to your personalized dashboard.
          </p>
        </div>
        <div className="mt-auto"><Logo size="sm" theme="dark"/></div>
      </aside>

      {/* ── Right pane ── */}
      <main className="w-full md:ml-[42%] md:w-[58%] min-h-screen bg-white flex flex-col">

        {/* Mobile header */}
        <div className="md:hidden flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <Logo size="sm" theme="light"/>
          <Link href="/signup" className="text-xs text-gray-500 hover:text-black">Sign up</Link>
        </div>

        {/* Desktop header */}
        <header className="hidden md:flex justify-end items-center gap-8 px-10 py-5">
          <Link href="/about" className="text-sm text-gray-500 hover:text-black">About</Link>
        </header>

        {/* Mobile: role selector pill row */}
        <div className="md:hidden flex gap-2 overflow-x-auto px-5 py-3 no-scrollbar">
          {RAW_ROLES.map(r => (
            <button key={r} onClick={() => setRole(r)}
              className={`flex-shrink-0 text-xs px-4 py-2 rounded-full border font-medium transition-all cursor-pointer ${
                role === r ? "bg-black text-white border-black" : "bg-white text-gray-600 border-gray-200"
              }`}>{r}</button>
          ))}
        </div>

        {/* Breadcrumb */}
        <nav className="hidden md:block px-10 mb-2">
          <p className="text-sm text-gray-400">Login&gt;<span className="text-gray-700">{role}</span></p>
        </nav>

        {/* Form card */}
        <div className="flex-1 flex items-start justify-center px-4 sm:px-6 pb-10 pt-4 md:pt-0 md:pb-16">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-md px-6 sm:px-10 py-8 sm:py-10">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
            <p className="text-sm text-gray-500 mb-7">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-black font-semibold hover:underline">Sign up</Link>
            </p>

            {/* OAuth row */}
            <div className="flex gap-3 mb-6">
              {[{label:"Apple",icon:"🍎"},{label:"Google",icon:"G"},{label:"Facebook",icon:"f"}].map(({label,icon}) => (
                <button key={label} aria-label={label}
                  type="button"
                  onClick={() => handleOAuth(label.toLowerCase() as OAuthProvider)}
                  className="flex-1 py-3 border border-gray-200 rounded-xl flex items-center justify-center text-sm font-semibold hover:bg-gray-50 cursor-pointer transition-colors">
                  {icon}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-gray-100"/>
              <span className="text-xs text-gray-400">or</span>
              <div className="flex-1 h-px bg-gray-100"/>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div>
                <label className="block text-sm text-gray-500 mb-2">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com" className={inp} required/>
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-2">Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Your password" className={inp} required/>
                <div className="text-right mt-1.5">
                  <button type="button" onClick={handleForgotPassword} className="text-xs text-gray-400 hover:text-black transition-colors cursor-pointer">
                    Forgot password?
                  </button>
                </div>
              </div>
              {error && <p className="text-xs text-red-500 -mt-2">{error}</p>}
              <button type="submit" disabled={loading}
                className="w-full py-4 rounded-xl bg-[#111] text-white text-sm font-semibold hover:bg-[#333] disabled:opacity-50 transition-all cursor-pointer">
                {loading ? "Signing in…" : "Sign In"}
              </button>
            </form>

            {devAccounts.length > 0 && (
              <div className="mt-6 pt-5 border-t border-gray-100">
                <p className="text-xs text-gray-400 mb-3">Dev mode quick login</p>
                <div className="grid grid-cols-2 gap-2">
                  {devAccounts.map(account => (
                    <button
                      key={account.key}
                      type="button"
                      disabled={loading}
                      onClick={() => handleDevLogin(account.key)}
                      className="text-xs border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50 disabled:opacity-50 transition-colors cursor-pointer"
                      title={account.email}
                    >
                      {account.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Mobile: already have account? */}
            <p className="md:hidden text-center text-xs text-gray-400 mt-6">
              New here?{" "}
              <Link href="/signup" className="text-black font-semibold">Create an account</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function LoginPage() { return <Suspense><Inner/></Suspense>; }
