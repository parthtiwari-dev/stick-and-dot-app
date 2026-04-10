"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthLayout, { useAuthRole } from "@/components/AuthLayout";
import OtpInput from "@/components/OtpInput";

/* ── Resend Code countdown hook ── */
function useResendCooldown(seconds = 30) {
  const [cooldown, setCooldown] = useState(0);

  const trigger = () => {
    setCooldown(seconds);
    const interval = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return { cooldown, trigger };
}

/* ── Inner content (inside AuthContext) ── */
function OtpContent() {
  const { selectedRole } = useAuthRole();
  const router = useRouter();

  // In a real app this comes from router state / session
  const maskedEmail = "shaivyasaini04@gmail.com";

  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { cooldown, trigger: startCooldown } = useResendCooldown(30);

  const isComplete = otp.length === 6;

  const handleContinue = async () => {
    if (!isComplete) return;
    setError("");
    setIsLoading(true);

    try {
      // Replace with your actual API call
      await new Promise((res) => setTimeout(res, 1000));
      router.push("/signup/details"); // Step 3
    } catch {
      setError("Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    if (cooldown > 0) return;
    startCooldown();
    // Replace with your actual resend API call
    console.log("Resending OTP to", maskedEmail);
  };

  return (
    <>
      {/* ── Top Header ── */}
      <header className="flex justify-end items-center px-10 py-5 gap-8">
        <Link
          href="/community"
          className="text-sm text-gray-600 hover:text-black transition-colors font-medium"
        >
          Community
        </Link>
        <Link
          href="/about"
          className="text-sm text-gray-600 hover:text-black transition-colors font-medium"
        >
          About
        </Link>
      </header>

      {/* ── Breadcrumb ── */}
      <nav aria-label="breadcrumb" className="px-10 mb-6">
        <p className="text-sm text-gray-500">
          <Link
            href="/signup"
            className="hover:text-black transition-colors"
          >
            Signup
          </Link>
          <span className="mx-1 text-gray-400">&gt;</span>
          <Link
            href="/signup"
            className="hover:text-black transition-colors"
          >
            {selectedRole}
          </Link>
          <span className="mx-1 text-gray-400">&gt;</span>
          <span className="text-gray-700 font-medium">OTP</span>
        </p>
      </nav>

      {/* ── Card ── */}
      <div className="flex justify-center px-6 pb-16">
        <div className="bg-white rounded-xl shadow-md w-full max-w-120 px-10 py-10">

          {/* Step indicator */}
          <p className="text-sm text-gray-400 mb-1 tracking-wide">
            Step 2 of 3
          </p>

          {/* Title */}
          <h1 className="text-[2rem] font-bold text-gray-900 leading-tight mb-3">
            Enter OTP
          </h1>

          {/* Subtitle */}
          <p className="text-sm text-gray-500 mb-10">
            An 6 digit code has been sent to{" "}
            <span className="text-gray-800 font-medium">{maskedEmail}</span>
          </p>

          {/* OTP Input */}
          <div className="mb-10">
            <OtpInput
              length={6}
              onChange={(val) => {
                setOtp(val);
                setError("");
              }}
              onComplete={(val) => setOtp(val)}
            />

            {/* Inline error */}
            {error && (
              <p className="mt-4 text-xs text-red-500" role="alert">
                {error}
              </p>
            )}
          </div>

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            disabled={!isComplete || isLoading}
            className={`
              w-full py-4 rounded-lg text-white text-sm font-semibold tracking-wide
              transition-all duration-200 active:scale-[0.99] cursor-pointer
              ${
                isComplete && !isLoading
                  ? "bg-[#111111] hover:bg-[#2a2a2a]"
                  : "bg-gray-300 cursor-not-allowed"
              }
            `}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="w-4 h-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                Verifying...
              </span>
            ) : (
              "Continue"
            )}
          </button>

          {/* Resend */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Didn&apos;t receive code?{" "}
            <button
              onClick={handleResend}
              disabled={cooldown > 0}
              className={`font-medium transition-colors ${
                cooldown > 0
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
              }`}
            >
              {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend Code"}
            </button>
          </p>
        </div>
      </div>
    </>
  );
}

/* ── Default Export ── */
export default function OtpPage() {
  return (
    <AuthLayout>
      <OtpContent />
    </AuthLayout>
  );
}
