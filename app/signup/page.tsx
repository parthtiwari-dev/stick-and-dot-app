"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import OtpInput from "@/components/OtpInput";

function useResendCooldown(seconds = 30) {
  const [cooldown, setCooldown] = useState(0);
  const trigger = () => {
    setCooldown(seconds);
    const interval = setInterval(() => {
      setCooldown((prev) => { if (prev <= 1) { clearInterval(interval); return 0; } return prev - 1; });
    }, 1000);
  };
  return { cooldown, trigger };
}

function OtpInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "Writer";
  const maskedEmail = "shaivyasaini04@gmail.com";
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { cooldown, trigger: startCooldown } = useResendCooldown(30);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) { setError("Please enter the 6-digit code."); return; }
    setError(""); setIsLoading(true);
    await new Promise((res) => setTimeout(res, 600));
    setIsLoading(false);
    router.push(`/signup/details?role=${encodeURIComponent(role)}`);
  };

  return (
    <div className="flex min-h-screen">
      {/* Left pane */}
      <aside className="hidden md:flex flex-col fixed top-0 left-0 h-screen w-[40%] bg-black text-white px-10 py-10 z-10">
        <div className="mb-auto"><span className="text-2xl font-bold">Logo</span></div>
        <div className="flex flex-col justify-center flex-1 mt-8">
          <p className="text-lg mb-6">Present <strong>yourself</strong> as...</p>
          <div className="flex flex-col gap-3">
            {["Writer","Reader","Subject Expert","Client"].map((r) => (
              <div key={r} className={`w-full py-3 px-6 rounded-lg border border-white/70 text-sm font-medium ${r === role ? "bg-white text-black" : "text-white opacity-40"}`}>{r}</div>
            ))}
          </div>
        </div>
        <div className="text-center mt-auto">
          <p className="text-sm text-gray-300 mb-1">Humane than AI, faster than human</p>
          <p className="text-xl font-bold underline underline-offset-4">Stick&amp;Dot.</p>
        </div>
      </aside>

      {/* Right pane */}
      <main className="w-full md:ml-[40%] md:w-[60%] min-h-screen bg-[#FAFBFC] overflow-y-auto">
        <header className="flex justify-end px-10 py-5">
          <p className="text-sm text-gray-500">Step 2 of 3</p>
        </header>
        <nav className="px-10 mb-6">
          <p className="text-sm text-gray-500">Signup &gt; <span className="text-gray-700 font-medium">{role}</span> &gt; OTP</p>
        </nav>
        <div className="flex justify-center px-6 pb-16">
          <div className="bg-white rounded-xl shadow-md w-full max-w-md px-10 py-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Enter OTP</h1>
            <p className="text-sm text-gray-500 mb-8">We sent a 6-digit code to <span className="font-medium text-gray-700">{maskedEmail}</span></p>
            <form onSubmit={handleVerify} noValidate>
              <OtpInput length={6} value={otp} onChange={setOtp} />
              {error && <p className="text-red-500 text-xs mt-3">{error}</p>}
              <button type="submit" disabled={isLoading}
                className="w-full mt-8 py-4 rounded-lg bg-[#111111] text-white text-sm font-semibold hover:bg-[#2a2a2a] disabled:opacity-60 transition-all cursor-pointer">
                {isLoading ? "Verifying…" : "Verify & Continue"}
              </button>
            </form>
            <div className="mt-6 text-center">
              {cooldown > 0 ? (
                <p className="text-xs text-gray-400">Resend code in {cooldown}s</p>
              ) : (
                <button onClick={startCooldown} className="text-xs text-blue-600 hover:underline">Resend code</button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function OtpPage() {
  return <Suspense><OtpInner /></Suspense>;
}
