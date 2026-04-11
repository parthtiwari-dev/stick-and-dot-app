"use client";
import { useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

type Role = "Writer" | "Reader" | "Subject Expert" | "Client";
const ROLES: Role[] = ["Writer", "Reader", "Subject Expert", "Client"];

function Inner() {
  const router = useRouter();
  const sp = useSearchParams();
  const role = (sp.get("role") as Role) || "Writer";
  const email = sp.get("email") || "you@example.com";

  const [digits, setDigits] = useState<string[]>(["","","","","",""]);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const setRef = (el: HTMLInputElement | null, i: number) => {
    inputRefs.current[i] = el;
  };

  const handleChange = (i: number, val: string) => {
    const ch = val.replace(/\D/g,"").slice(-1);
    const next = [...digits];
    next[i] = ch;
    setDigits(next);
    if (ch && i < 5) {
      inputRefs.current[i + 1]?.focus();
    }
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      inputRefs.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g,"").slice(0,6);
    const next = [...digits];
    pasted.split("").forEach((ch, idx) => { if (idx < 6) next[idx] = ch; });
    setDigits(next);
    const lastFilled = Math.min(pasted.length, 5);
    inputRefs.current[lastFilled]?.focus();
  };

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    setLoading(false);
    router.push(`/signup/details?role=${encodeURIComponent(role)}&email=${encodeURIComponent(email)}`);
  };

  return (
    <div className="flex min-h-screen">
      {/* Left pane */}
      <aside className="hidden md:flex flex-col fixed top-0 left-0 h-screen w-[42%] bg-black text-white px-10 py-10 z-10 select-none">
        <div className="mb-auto"><span className="text-2xl font-bold">Logo</span></div>
        <div className="flex flex-col justify-center flex-1">
          <p className="text-lg mb-6 leading-snug">Present <strong>yourself</strong> as...</p>
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
          <p className="text-sm text-gray-400">Signup&gt;{role}&gt;<span className="text-gray-700">OTP</span></p>
        </nav>
        <div className="flex justify-center px-6 pb-16">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-md px-10 py-10">
            <p className="text-xs text-gray-400 mb-1">Step 2 of 3</p>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Enter OTP</h1>
            <p className="text-sm text-gray-500 mb-8">
              A 6 digit code has been sent to <span className="text-gray-800 font-medium">{email}</span>
            </p>

            <form onSubmit={handleContinue}>
              <div className="flex gap-3 mb-8" onPaste={handlePaste}>
                {digits.map((d, i) => (
                  <input
                    key={i}
                    ref={el => setRef(el, i)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={d}
                    onChange={e => handleChange(i, e.target.value)}
                    onKeyDown={e => handleKeyDown(i, e)}
                    className="w-12 h-14 border-b-2 border-gray-300 focus:border-black text-center text-xl font-semibold text-gray-900 outline-none bg-transparent transition-colors flex-shrink-0"
                  />
                ))}
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-4 rounded-xl bg-[#111] text-white text-sm font-semibold hover:bg-[#333] disabled:opacity-50 transition-all cursor-pointer">
                {loading ? "Verifying…" : "Continue"}
              </button>

              <p className="text-center mt-4 text-sm text-gray-400">
                Didn&apos;t receive code?{" "}
                <button type="button" className="text-black font-semibold hover:underline cursor-pointer">
                  Resend Code
                </button>
              </p>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function OtpPage() { return <Suspense><Inner /></Suspense>; }
