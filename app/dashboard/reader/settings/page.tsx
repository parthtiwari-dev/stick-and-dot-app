"use client";
import { useUser } from "@/components/UserContext";
import AppLayout from "@/components/AppLayout";

export default function ReaderSettings() {
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
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-2xl flex-shrink-0">👤</div>
            <div>
              <p className="text-gray-900 font-semibold">{userName || "Your Name"}</p>
              <p className="text-gray-500 text-xs mt-0.5">Reader</p>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            {[
              { label:"Full Name",    placeholder:userName || "Your name",      type:"text"  },
              { label:"Email",        placeholder:"your@email.com",             type:"email" },
              { label:"Mobile",       placeholder:"+91 00000 00000",            type:"tel"   },
            ].map(({ label, placeholder, type }) => (
              <div key={label}>
                <label className="block text-xs text-gray-500 mb-1.5">{label}</label>
                <input type={type} defaultValue="" placeholder={placeholder}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-gray-400 bg-white placeholder:text-gray-300 transition-colors"/>
              </div>
            ))}
            <button className="w-full py-3 rounded-xl bg-[#111] text-white text-sm font-semibold hover:bg-[#333] transition-colors cursor-pointer">
              Save Changes
            </button>
          </div>
        </div>

        {/* Password */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-4">
          <p className="text-sm font-semibold text-gray-800 mb-5">Password</p>
          <div className="flex flex-col gap-5">
            {["Current Password","New Password","Confirm New Password"].map(label => (
              <div key={label}>
                <label className="block text-xs text-gray-500 mb-1.5">{label}</label>
                <input type="password" placeholder="••••••••"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-gray-400 bg-white transition-colors"/>
              </div>
            ))}
            <button className="w-full py-3 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors cursor-pointer">
              Update Password
            </button>
          </div>
        </div>

        {/* Genre Preferences */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-4">
          <p className="text-sm font-semibold text-gray-800 mb-1">Genre Preferences</p>
          <p className="text-xs text-gray-400 mb-4">Select the topics you want to see in your Explore feed</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {["Technology","Finance","Science","Culture","Business","Health","Design","Law","Education"].map(genre => (
              <label key={genre} className="flex items-center gap-2.5 cursor-pointer group">
                <input type="checkbox" defaultChecked={["Technology","Finance","Culture"].includes(genre)}
                  className="w-4 h-4 rounded border-gray-300 accent-black cursor-pointer"/>
                <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">{genre}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <p className="text-sm font-semibold text-gray-800 mb-4">Notifications</p>
          <div className="flex flex-col gap-5">
            {[
              { label:"New articles in my genres",        sub:"Get notified when verified articles match your preferences" },
              { label:"Reading streak reminders",         sub:"Daily nudge to keep your streak going"                     },
              { label:"Accuracy score updates",           sub:"When your opinion rating changes"                          },
            ].map(({ label, sub }) => (
              <div key={label} className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-800">{label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
                </div>
                <div className="w-10 h-5 bg-[#111] rounded-full flex-shrink-0 relative cursor-pointer mt-0.5">
                  <div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm"/>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
