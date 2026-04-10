"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import OtpInput from "@/components/OtpInput";

type Role = "Writer" | "Reader" | "Subject Expert" | "Client";
const ROLES: Role[] = ["Writer", "Reader", "Subject Expert", "Client"];

function useResendCooldown(seconds = 30) {
  const [cooldown, setCooldown] = useState(0);
  const trigger = () => {
    setCooldown(seconds);
    const interval = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
  };
  return { cooldown, trigger };
}

function OtpInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = (searchParams.get("role") as Role) || "Writer";
  const email = searchParams.get("email") || "your email";

  const [selectedRole, setSelectedRole] = useState<Role>(initialRole);
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { cooldown, trigger: startCooldown } = useResendCooldown(30);

  const handleRoleSwitch = (role: Role) => {
    setSelectedRole(role);
    // Go back to step 1 with the new role pre-selected
    router.push(`/signup?role=${encodeURIComponent(role)}`);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) { setError("Please enter the 6-digit code."); return; }
    setError("");
    setIsLoading(true);
    // TODO: POST /api/auth/verify-otp { otp, role: selectedRole }
    await new Promise((res) => setTimeout(res, 600));
    setIsLoading(false);
    router.push(`/signup/details?role=${encodeURIComponent(selectedRole)}&email=${encodeURIComponent(email)}`);
  };

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
        <header className="flex justify-end px-10 py-5">
          <p className="text-sm text-gray-500">Step 2 of 3</p>
        </header>
        <nav className="px-10 mb-6">
          <p className="text-sm text-gray-500">
            Signup &gt;{" "}
            <span className="text-gray-700 font-medium">{selectedRole}</span>
            {" "}&gt; OTP
          </p>
        </nav>
        <div className="flex justify-center px-6 pb-16">
          <div className="bg-white rounded-xl shadow-md w-full max-w-md px-10 py-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Enter OTP</h1>
            <p className="text-sm text-gray-500 mb-8">
              We sent a 6-digit code to{" "}
              <span className="font-medium text-gray-700">{email}</span>
            </p>
            <form onSubmit={handleVerify} noValidate>
              <OtpInput length={6} onChange={setOtp} />
              {error && <p className="text-red-500 text-xs mt-3">{error}</p>}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-8 py-4 rounded-lg bg-[#111111] text-white text-sm font-semibold hover:bg-[#2a2a2a] disabled:opacity-60 transition-all cursor-pointer"
              >
                {isLoading ? "Verifying…" : "Verify & Continue"}
              </button>
            </form>
            <div className="mt-6 text-center">
              {cooldown > 0 ? (
                <p className="text-xs text-gray-400">Resend code in {cooldown}s</p>
              ) : (
                <button
                  onClick={startCooldown}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Resend code
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function OtpPage() {
  return (
    <Suspense>
      <OtpInner />
    </Suspense>
  );
}
