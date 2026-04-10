"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Calendar } from "lucide-react";
import AuthLayout, { useAuthRole } from "@/components/AuthLayout";

/* ── Reusable bottom-border field wrapper ── */
interface FieldProps {
  label: string;
  children: React.ReactNode;
}

function Field({ label, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-gray-500">{label}</label>
      {children}
    </div>
  );
}

/* ── Shared input className ── */
const inputCls =
  "w-full border-b border-gray-300 bg-transparent outline-none focus:border-black py-2 text-sm text-gray-900 transition-colors duration-200 caret-black placeholder-transparent";

/* ── Gender options ── */
const GENDERS = ["Male", "Female", "Non-binary", "Prefer not to say"];

/* ── Inner content (inside AuthContext) ── */
function DetailsContent() {
  const { selectedRole } = useAuthRole();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    domain: "",
    gender: "",
    dob: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const dobRef = useRef<HTMLInputElement>(null);

  const set = (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Replace with real API call
      await new Promise((res) => setTimeout(res, 800));
      // Persist selected role so dashboard can route correctly
      localStorage.setItem("sd_user_role", selectedRole);
      localStorage.setItem("sd_user_name", form.name || "Shaivya");
      router.push("/dashboard"); // or wherever step 3 leads
    } catch (err) {
      console.error("Details submission failed", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    localStorage.setItem("sd_user_role", selectedRole);
    router.push("/dashboard");
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
          <Link href="/signup" className="hover:text-black transition-colors">
            {selectedRole}
          </Link>
          <span className="mx-1 text-gray-400">&gt;</span>
          <Link
            href="/signup/otp"
            className="hover:text-black transition-colors"
          >
            OTP
          </Link>
          <span className="mx-1 text-gray-400">&gt;</span>
          <span className="text-gray-700 font-medium">Details</span>
        </p>
      </nav>

      {/* ── Card ── */}
      <div className="flex justify-center px-6 pb-16">
        <div className="bg-white rounded-xl shadow-md w-full max-w-120 px-10 py-10">

          {/* Step indicator */}
          <p className="text-sm text-gray-400 mb-1 tracking-wide">
            Step 3 of 3
          </p>

          {/* Title */}
          <h1 className="text-[2rem] font-bold text-gray-900 leading-tight mb-9">
            Add Details
          </h1>

          <form onSubmit={handleSubmit} noValidate>
            <div className="flex flex-col gap-7">

              {/* Name */}
              <Field label="Name">
                <input
                  type="text"
                  autoComplete="name"
                  value={form.name}
                  onChange={set("name")}
                  className={inputCls}
                  aria-label="Full name"
                />
              </Field>

              {/* Mobile No. */}
              <Field label="Mobile No.">
                <input
                  type="tel"
                  autoComplete="tel"
                  value={form.mobile}
                  onChange={set("mobile")}
                  className={inputCls}
                  aria-label="Mobile number"
                />
              </Field>

              {/* Name of Domain */}
              <Field label="Name of Domain">
                <input
                  type="text"
                  value={form.domain}
                  onChange={set("domain")}
                  className={inputCls}
                  aria-label="Domain name"
                />
              </Field>

              {/* Gender + DOB — 2-column grid */}
              <div className="grid grid-cols-2 gap-6">

                {/* Gender */}
                <Field label="Gender">
                  <select
                    value={form.gender}
                    onChange={set("gender")}
                    aria-label="Gender"
                    className={`
                      ${inputCls}
                      appearance-none cursor-pointer
                      ${form.gender === "" ? "text-gray-400" : "text-gray-900"}
                    `}
                  >
                    <option value="" disabled hidden></option>
                    {GENDERS.map((g) => (
                      <option key={g} value={g} className="text-gray-900">
                        {g}
                      </option>
                    ))}
                  </select>
                </Field>

                {/* DOB */}
                <Field label="DOB">
                  <div className="relative flex items-center">
                    <input
                      ref={dobRef}
                      type="date"
                      value={form.dob}
                      onChange={set("dob")}
                      aria-label="Date of birth"
                      max={new Date().toISOString().split("T")[0]}
                      className={`
                        ${inputCls}
                        pr-7
                        scheme-light
                        [&::-webkit-calendar-picker-indicator]:opacity-0
                        [&::-webkit-calendar-picker-indicator]:absolute
                        [&::-webkit-calendar-picker-indicator]:inset-0
                        [&::-webkit-calendar-picker-indicator]:w-full
                        [&::-webkit-calendar-picker-indicator]:cursor-pointer
                        ${form.dob === "" ? "text-gray-400" : "text-gray-900"}
                      `}
                    />
                    {/* Custom calendar icon — clicking it opens the native picker */}
                    <button
                      type="button"
                      aria-label="Open date picker"
                      onClick={() => dobRef.current?.showPicker?.()}
                      className="absolute right-0 bottom-2 text-gray-400 hover:text-gray-700 transition-colors pointer-events-auto"
                    >
                      <Calendar size={16} strokeWidth={1.5} />
                    </button>
                  </div>
                </Field>
              </div>
            </div>

            {/* Continue Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`
                mt-10 w-full py-4 rounded-lg text-white text-sm font-semibold tracking-wide
                transition-all duration-200 active:scale-[0.99] cursor-pointer
                ${isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-[#111111] hover:bg-[#2a2a2a]"}
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
                  Saving...
                </span>
              ) : (
                "Continue"
              )}
            </button>
          </form>

          {/* Skip for now */}
          <div className="text-center mt-5">
            <button
              type="button"
              onClick={handleSkip}
              className="text-sm text-gray-600 underline underline-offset-4 hover:text-black transition-colors cursor-pointer"
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Default Export ── */
export default function DetailsPage() {
  return (
    <AuthLayout>
      <DetailsContent />
    </AuthLayout>
  );
}
