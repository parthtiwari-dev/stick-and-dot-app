"use client";
import { useUser } from "@/components/UserContext";
import AppLayout from "@/components/AppLayout";
import { Search } from "lucide-react";

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-start gap-2 py-1.5 border-b border-gray-50 last:border-0">
    <span className="text-gray-400 text-xs w-28 flex-shrink-0">{label}</span>
    <span className="text-gray-700 text-xs">{value}</span>
  </div>
);

export default function BusinessSettings() {
  const { userName } = useUser();
  return (
    <AppLayout bg="bg-[#F4F4F4]">
      <div className="p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Dashboard&gt;Settings</p>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Settings</h1>
          </div>
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-400 w-44">
            <Search size={13}/><span>Search</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 max-w-4xl">
          {/* Company Details */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <p className="text-sm font-semibold text-gray-800 mb-4">Company Details</p>
            <div className="space-y-0.5 mb-5">
              <InfoRow label="Company Name"    value="Acme Corp."               />
              <InfoRow label="Contact Person"  value={userName || "Richard Tyson"} />
              <InfoRow label="Email"           value="contact@acmecorp.com"      />
              <InfoRow label="Phone"           value="+91 81325 13228"           />
              <InfoRow label="Address"         value="Merdeka Street, Wonosobo"  />
            </div>
            <button className="w-full py-3 rounded-xl bg-[#111] text-white text-sm font-semibold cursor-pointer hover:bg-[#333] transition-colors">
              Edit Details
            </button>
          </div>

          {/* Password & Security */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <p className="text-sm font-semibold text-gray-800 mb-4">Password & Security</p>
            <div className="flex flex-col gap-4">
              {["Current Password","New Password","Confirm New Password"].map(label => (
                <div key={label}>
                  <label className="block text-xs text-gray-500 mb-1">{label}</label>
                  <input type="password" placeholder="••••••••"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-gray-400 bg-white transition-colors"/>
                </div>
              ))}
              <button className="w-full py-3 rounded-xl bg-[#111] text-white text-sm font-semibold cursor-pointer hover:bg-[#333] transition-colors">
                Update Password
              </button>
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <p className="text-sm font-semibold text-gray-800 mb-4">Payment Details</p>
            <div className="space-y-0.5 mb-5">
              <InfoRow label="Bank Name"  value="HDFC Bank"  />
              <InfoRow label="Account No" value="•••••• 4821" />
              <InfoRow label="IFSC Code"  value="••••••"      />
            </div>
            <button className="w-full py-3 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold cursor-pointer hover:bg-gray-50 transition-colors">
              Update Payment Info
            </button>
          </div>

          {/* Notification Preferences */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <p className="text-sm font-semibold text-gray-800 mb-4">Notifications</p>
            <div className="flex flex-col gap-4">
              {[
                { label:"Commission accepted by writer",   sub:"Get notified when a writer picks up your commission" },
                { label:"Article delivered",               sub:"When commissioned content is ready for review"       },
                { label:"SME review completed",            sub:"When an SME approves or requests revision"           },
                { label:"Payment confirmation",            sub:"Transaction receipts and payment updates"            },
              ].map(({ label, sub }) => (
                <div key={label} className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-800">{label}</p>
                    <p className="text-xs text-gray-400">{sub}</p>
                  </div>
                  <div className="w-10 h-5 bg-[#111] rounded-full flex-shrink-0 relative cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5"/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
