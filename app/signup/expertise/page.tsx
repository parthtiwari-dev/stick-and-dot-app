"use client";
import { useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Logo from "@/components/Logo";
import { type RawRole, RAW_ROLES, dashRootPath } from "@/lib/roles";
import { Upload, CheckCircle } from "lucide-react";
import { updateCurrentProfile, uploadProfileFile } from "@/lib/supabase/profile";

const DOMAINS = [
  "Technology","Finance","Medical / Health","Law","Science",
  "Engineering","Education","Business","Culture","Other",
];

function Inner() {
  const router = useRouter();
  const sp     = useSearchParams();
  const role   = (sp.get("role") as RawRole) || "Writer";
  const name   = sp.get("name") || "";
  const email  = sp.get("email") || "";

  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [file, setFile]       = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const toggleDomain = (d: string) =>
    setSelectedDomains(p => p.includes(d) ? p.filter(x => x !== d) : [...p, d]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const uploadedPath = file ? await uploadProfileFile(file) : null;
      await updateCurrentProfile({
        role,
        name,
        email,
        expertise_domains: selectedDomains,
        credential_file_path: uploadedPath,
      });
      router.push(dashRootPath(role));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save expertise.");
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    void updateCurrentProfile({ role, name, email })
      .then(() => router.push(dashRootPath(role)))
      .catch(err => setError(err instanceof Error ? err.message : "Unable to skip."));
  };

  const isWriter = role === "Writer";
  const stepLabel = isWriter ? "Writer" : "Subject Expert";

  return (
    <div className="flex min-h-screen">
      {/* Left pane */}
      <aside className="hidden md:flex flex-col fixed top-0 left-0 h-screen w-[42%] bg-black text-white px-10 py-10 z-10 select-none">
        <div className="mb-auto">
          <Logo size="lg" theme="dark"/>
        </div>
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
        <div className="mt-auto">
          <Logo size="sm" theme="dark"/>
        </div>
      </aside>

      {/* Right pane */}
      <main className="w-full md:ml-[42%] md:w-[58%] min-h-screen bg-white overflow-y-auto">
        <header className="flex justify-end items-center gap-8 px-10 py-5">
          <a href="/about" className="text-sm text-gray-500 hover:text-black">About</a>
        </header>
        <nav className="px-10 mb-4">
          <p className="text-sm text-gray-400">
            Signup&gt;{role}&gt;OTP&gt;Details&gt;<span className="text-gray-700">Expertise</span>
          </p>
        </nav>

        <div className="flex justify-center px-6 pb-16">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-md px-10 py-10">
            <p className="text-xs text-gray-400 mb-1">Step 4 of 4</p>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isWriter ? "Your Writing Credentials" : "Your Expertise"}
            </h1>
            <p className="text-sm text-gray-500 mb-8">
              {isWriter
                ? "Upload writing samples and select the domains you write about. This helps businesses and editors trust your work."
                : "Upload your credentials and select your domain of expertise. Our team will verify and badge your profile."}
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-7">

              {/* Domain selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  {isWriter ? "Domains You Write About" : "Domain of Expertise"}
                </label>
                <p className="text-xs text-gray-400 mb-3">Select all that apply</p>
                <div className="flex flex-wrap gap-2">
                  {DOMAINS.map(d => (
                    <button key={d} type="button" onClick={() => toggleDomain(d)}
                      className={`text-sm px-4 py-2 rounded-xl border font-medium transition-all cursor-pointer ${
                        selectedDomains.includes(d)
                          ? "bg-[#111] text-white border-[#111]"
                          : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                      }`}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* File upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">
                  {isWriter ? "Writing Samples" : "Credentials / Certificates"}
                </label>
                <p className="text-xs text-gray-400 mb-3">
                  {isWriter
                    ? "Upload 1–3 past articles or writing samples (PDF, DOC, or link in a text file)"
                    : "Upload your degree, certification, or other verifiable credentials (PDF)"}
                </p>

                <div
                  onClick={() => fileRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors ${
                    file ? "border-green-300 bg-green-50" : "border-gray-200 hover:border-gray-400 bg-gray-50"
                  }`}>
                  {file ? (
                    <>
                      <CheckCircle size={28} className="text-green-500"/>
                      <p className="text-sm text-green-700 font-medium text-center">{file.name}</p>
                      <p className="text-xs text-green-500">Tap to change</p>
                    </>
                  ) : (
                    <>
                      <Upload size={28} className="text-gray-400"/>
                      <p className="text-sm text-gray-600 font-medium text-center">Drop file here or tap to browse</p>
                      <p className="text-xs text-gray-400">PDF, DOC, DOCX up to 10MB</p>
                    </>
                  )}
                  <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" onChange={handleFile} className="hidden"/>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-4 rounded-xl bg-[#111] text-white text-sm font-semibold hover:bg-[#333] disabled:opacity-50 transition-all cursor-pointer">
                {loading ? "Saving…" : `Continue as ${stepLabel}`}
              </button>

              {error && <p className="text-xs text-red-500 -mt-2">{error}</p>}

              <button type="button" onClick={handleSkip}
                className="text-sm text-gray-500 hover:text-black text-center transition-colors cursor-pointer underline">
                Skip for now
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ExpertisePage() { return <Suspense><Inner/></Suspense>; }
