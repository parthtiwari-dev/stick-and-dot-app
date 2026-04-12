"use client";
import AppLayout from "@/components/AppLayout";
import { Search } from "lucide-react";
import { useUser } from "@/components/UserContext";

const NICHE_TAGS = ["Technology","Finance","Health","Science","Law","Education","Business","Culture","Politics","Environment"];

export default function WriterSettings() {
  const { userName } = useUser();
  return (
    <AppLayout bg="bg-[#F4F4F4]">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Dashboard&gt;Settings</p>
            <h1 className="text-2xl font-bold text-gray-900">Welcome, {userName}</h1>
          </div>
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-400 w-44">
            <Search size={13} /><span>Search</span>
          </div>
        </div>

        <div className="flex gap-5 items-start">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 w-[280px] flex-shrink-0">
            <div className="flex flex-col items-center mb-5">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-4xl mb-3">
                <span>👤</span>
              </div>
              <p className="text-gray-900 font-semibold text-base">{userName}</p>
              <p className="text-gray-500 text-xs">Writer</p>
            </div>
            <button className="w-full py-3 rounded-xl bg-[#F97316] text-white text-sm font-semibold cursor-pointer hover:bg-[#ea6c0a] transition-colors">
              Edit Profile
            </button>
          </div>

          <div className="flex-1 flex flex-col gap-5">
            {/* Payout Info */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <p className="text-base font-semibold text-gray-900 mb-1">Payout Details</p>
              <p className="text-xs text-gray-400 mb-5">Where you receive your earnings</p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Bank Name",    placeholder: "e.g. SBI, HDFC" },
                  { label: "Account No.", placeholder: "•••• •••• 1234" },
                  { label: "IFSC Code",   placeholder: "e.g. SBIN0001234" },
                  { label: "UPI ID",      placeholder: "yourname@upi" },
                ].map(({ label, placeholder }) => (
                  <div key={label}>
                    <label className="block text-xs text-gray-500 mb-1">{label}</label>
                    <input
                      type="text"
                      placeholder={placeholder}
                      className="w-full border-b border-gray-200 bg-transparent outline-none focus:border-gray-800 py-2 text-sm text-gray-800 placeholder:text-gray-300 transition-colors"
                    />
                  </div>
                ))}
              </div>
              <button className="mt-5 px-5 py-2.5 bg-[#111] text-white text-xs font-semibold rounded-xl hover:bg-[#333] cursor-pointer transition-colors">
                Save Payout Info
              </button>
            </div>

            {/* Notification Preferences */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <p className="text-base font-semibold text-gray-900 mb-1">Notifications</p>
              <p className="text-xs text-gray-400 mb-5">Choose what you want to be notified about</p>
              <div className="flex flex-col gap-4">
                {[
                  { label: "New commission assigned",   desc: "When a business commissions your work" },
                  { label: "Review feedback received",  desc: "When a subject expert reviews your article" },
                  { label: "Payment processed",         desc: "When a payout is sent to your account" },
                  { label: "Weekly performance report", desc: "Summary of your views and engagement" },
                ].map(({ label, desc }) => (
                  <div key={label} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-800 font-medium">{label}</p>
                      <p className="text-xs text-gray-400">{desc}</p>
                    </div>
                    <div className="relative w-10 h-5 cursor-pointer">
                      <div className="w-10 h-5 bg-[#111] rounded-full" />
                      <div className="absolute top-0.5 right-0.5 w-4 h-4 bg-white rounded-full shadow" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Writing Niche Tags */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <p className="text-base font-semibold text-gray-900 mb-1">Writing Niches</p>
              <p className="text-xs text-gray-400 mb-5">Select topics you write about — helps match you with the right commissions</p>
              <div className="flex flex-wrap gap-2">
                {NICHE_TAGS.map((tag, i) => (
                  <button key={tag}
                    className={`px-4 py-2 rounded-full text-xs font-medium border cursor-pointer transition-colors ${
                      [0, 2, 5].includes(i)
                        ? "bg-[#111] text-white border-[#111]"
                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                    }`}>
                    {tag}
                  </button>
                ))}
              </div>
              <button className="mt-5 px-5 py-2.5 bg-[#111] text-white text-xs font-semibold rounded-xl hover:bg-[#333] cursor-pointer transition-colors">
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
