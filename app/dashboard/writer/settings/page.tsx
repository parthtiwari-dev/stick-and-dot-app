"use client";
import AppLayout from "@/components/AppLayout";
import { useUser } from "@/components/UserContext";

export default function WriterSettings() {
  const { userName } = useUser();
  return (
    <AppLayout bg="bg-[#F4F4F4]">
      <div className="p-4 md:p-6 max-w-2xl">
        <div className="mb-6">
          <p className="text-xs text-gray-400 mb-0.5">Dashboard&gt;Settings</p>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Settings</h1>
        </div>

        {/* Profile card */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-4">
          <p className="text-sm font-semibold text-gray-800 mb-5">Profile</p>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-2xl flex-shrink-0">👤</div>
            <div>
              <p className="text-gray-900 font-semibold">{userName || "Your Name"}</p>
              <p className="text-gray-500 text-xs mt-0.5">Writer</p>
            </div>
          </div>
          <div className="flex flex-col gap-5">
            {[
              { label:"Full Name",     placeholder:"Your full name",           type:"text" },
              { label:"Email Address", placeholder:"your@email.com",           type:"email" },
              { label:"New Password",  placeholder:"Leave blank to keep current", type:"password" },
            ].map(({ label, placeholder, type }) => (
              <div key={label}>
                <label className="block text-xs text-gray-500 mb-1">{label}</label>
                <input type={type} placeholder={placeholder}
                  className="w-full border-b border-gray-200 bg-transparent outline-none focus:border-gray-800 py-2 text-sm text-gray-800 placeholder:text-gray-300 transition-colors"/>
              </div>
            ))}
          </div>
          <button className="mt-5 px-5 py-2.5 bg-[#111] text-white text-xs font-semibold rounded-xl hover:bg-[#333] cursor-pointer transition-colors">
            Save Profile
          </button>
        </div>

        {/* Payout */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-4">
          <p className="text-sm font-semibold text-gray-800 mb-1">Payout Details</p>
          <p className="text-xs text-gray-400 mb-4">Where you receive your earnings</p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label:"Bank Name",    placeholder:"e.g. SBI, HDFC" },
              { label:"Account No.", placeholder:"•••• •••• 1234" },
              { label:"IFSC Code",   placeholder:"e.g. SBIN0001234" },
              { label:"UPI ID",      placeholder:"yourname@upi" },
            ].map(({ label, placeholder }) => (
              <div key={label}>
                <label className="block text-xs text-gray-500 mb-1">{label}</label>
                <input type="text" placeholder={placeholder}
                  className="w-full border-b border-gray-200 bg-transparent outline-none focus:border-gray-800 py-2 text-sm text-gray-800 placeholder:text-gray-300 transition-colors"/>
              </div>
            ))}
          </div>
          <button className="mt-5 px-5 py-2.5 bg-[#111] text-white text-xs font-semibold rounded-xl hover:bg-[#333] cursor-pointer transition-colors">
            Save Payout Info
          </button>
        </div>


      </div>
    </AppLayout>
  );
}
