"use client";
import { useUser } from "@/components/UserContext";
import AppLayout from "@/components/AppLayout";

export default function SubjectExpertSettings() {
  const { userName } = useUser();
  return (
    <AppLayout bg="bg-[#F4F4F4]">
      <div className="p-4 md:p-6 max-w-2xl">
        <div className="mb-6">
          <p className="text-xs text-gray-400 mb-0.5">Dashboard&gt;Settings</p>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Settings</h1>
        </div>

        {/* Profile */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-4">
          <p className="text-sm font-semibold text-gray-800 mb-5">Profile</p>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-400 to-green-500 flex items-center justify-center text-2xl flex-shrink-0">👤</div>
            <div>
              <p className="text-gray-900 font-semibold">{userName || "Your Name"}</p>
              <p className="text-gray-500 text-xs mt-0.5">Subject Matter Expert</p>
            </div>
          </div>
          <div className="flex flex-col gap-5">
            {[
              { label:"Full Name",     placeholder:"Your full name",     type:"text" },
              { label:"Email Address", placeholder:"your@email.com",     type:"email" },
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

        {/* Credentials */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-4">
          <p className="text-sm font-semibold text-gray-800 mb-1">Credentials</p>
          <p className="text-xs text-gray-400 mb-4">Upload your degree, certification, or proof of expertise</p>
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-gray-400 transition-colors">
            <p className="text-gray-400 text-sm mb-1">Click to upload a document</p>
            <p className="text-gray-300 text-xs">PDF, DOC, JPG up to 10MB</p>
            <input type="file" className="hidden"/>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs bg-green-50 text-green-600 border border-green-100 px-2.5 py-1 rounded-full">✓ Current: Medical_Degree.pdf</span>
          </div>
        </div>

        {/* Payout */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <p className="text-sm font-semibold text-gray-800 mb-1">Payout Details</p>
          <p className="text-xs text-gray-400 mb-4">Where you receive your review earnings</p>
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
