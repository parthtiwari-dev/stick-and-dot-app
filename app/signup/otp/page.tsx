"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import OtpInput from "@/components/OtpInput";

type Role = "Writer" | "Reader" | "Subject Expert" | "Client";

function Inner() {
  const router = useRouter();
  const sp = useSearchParams();
  const role = (sp.get("role") as Role) || "Writer";
  const email = sp.get("email") || "your email";
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [cooldown, setCooldown] = useState(0);

  const startCooldown = () => {
    setCooldown(30);
    const t = setInterval(() => setCooldown(p => { if (p <= 1) { clearInterval(t); return 0; } return p - 1; }), 1000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) return setErr("Please enter the 6-digit code.");
    setErr(""); setLoading(true);
    // TODO: POST /api/auth/verify-otp { otp, email, role }
    await new Promise(r => setTimeout(r, 600));
    setLoading(false);
    router.push(`/signup/details?role=${encodeURIComponent(role)}&email=${encodeURIComponent(email)}`);
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
          <p className="text-sm text-gray-400">Signup&gt;<span className="text-gray-600">{role}</span>&gt;OTP</p>
        </nav>
        <div className="flex justify-center px-6 pb-16">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-md px-10 py-10">
            <p className="text-xs text-gray-400 mb-1">Step 2 of 3</p>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Enter OTP</h1>
            <p className="text-sm text-gray-500 mb-8">A 6-digit code has been sent to <span className="font-medium text-gray-700">{email}</span></p>
            <form onSubmit={handleSubmit} noValidate>
              <OtpInput length={6} onChange={setOtp} />
              {err && <p className="text-red-500 text-xs mt-3">{err}</p>}
              <button type="submit" disabled={loading}
                className="w-full mt-8 py-4 rounded-xl bg-[#111] text-white text-sm font-semibold hover:bg-[#333] disabled:opacity-50 transition-all cursor-pointer">
                {loading ? "Verifying…" : "Continue"}
              </button>
            </form>
            <div className="mt-5 text-center">
              {cooldown > 0
                ? <p className="text-xs text-gray-400">Resend code in {cooldown}s</p>
                : <button onClick={startCooldown} className="text-xs text-gray-500 hover:underline">Didn&apos;t receive code? <span className="text-blue-500">Resend</span></button>
              }
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function OtpPage() { return <Suspense><Inner /></Suspense>; }
