"use client";

// Add this import at the top
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import AuthLayout, { useAuthRole } from "@/components/AuthLayout";

/* ─── Inline SVG Brand Icons ─── */
const AppleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
  </svg>
);

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#1877F2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

/* ─── Inner page content (can access AuthContext) ─── */
function SignupContent() {
  const { selectedRole } = useAuthRole();
  const router = useRouter(); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) return;

    try {
        // Replace this with your real API call (e.g. register user, send OTP)
        await new Promise((res) => setTimeout(res, 500)); // simulate network
        router.push("/signup/otp"); // ← THIS is what was missing
    } catch (err) {
        console.error("Signup failed", err);
    }
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
          <Link href="/signup" className="hover:text-black transition-colors">
            Signup
          </Link>
          <span className="mx-1 text-gray-400">&gt;</span>
          <span className="text-gray-700 font-medium">{selectedRole}</span>
        </p>
      </nav>

      {/* ── Card ── */}
      <div className="flex justify-center px-6 pb-16">
        <div className="bg-white rounded-xl shadow-md w-full max-w-120 px-10 py-10">

          {/* Step indicator */}
          <p className="text-sm text-gray-400 mb-1 tracking-wide">Step 1 of 3</p>

          {/* Title */}
          <h1 className="text-[2rem] font-bold text-gray-900 mb-8 leading-tight">
            Create an Account
          </h1>

          {/* Social Buttons */}
          <div className="flex justify-around mb-7">
            {[
              { label: "Continue with Apple", Icon: AppleIcon },
              { label: "Continue with Google", Icon: GoogleIcon },
              { label: "Continue with Facebook", Icon: FacebookIcon },
            ].map(({ label, Icon }) => (
              <button
                key={label}
                aria-label={label}
                className="w-14 h-14 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm cursor-pointer"
              >
                <Icon />
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-7">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Sub-header */}
          <p className="text-sm text-gray-500 mb-1">Sign up with Email</p>
          <p className="text-sm text-gray-700 mb-7">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
            >
              Sign in
            </Link>
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div className="mb-7 group">
              <label
                htmlFor="email"
                className="block text-sm text-gray-500 mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-b border-gray-300 bg-transparent outline-none focus:border-black py-2 text-sm text-gray-900 placeholder-transparent transition-colors duration-200 caret-black"
                required
              />
            </div>

            {/* Password */}
            <div className="mb-9 relative">
              <label
                htmlFor="password"
                className="block text-sm text-gray-500 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-b border-gray-300 bg-transparent outline-none focus:border-black py-2 text-sm text-gray-900 placeholder-transparent transition-colors duration-200 caret-black pr-8"
                required
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-0 bottom-2 text-gray-400 hover:text-gray-600 transition-colors text-xs select-none"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {/* Continue Button */}
            <button
              type="submit"
              className="w-full py-4 rounded-lg bg-[#111111] text-white text-sm font-semibold tracking-wide hover:bg-[#2a2a2a] active:scale-[0.99] transition-all duration-200 cursor-pointer"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

/* ─── Default Export ─── */
export default function SignupPage() {
  return (
    <AuthLayout>
      <SignupContent />
    </AuthLayout>
  );
}
