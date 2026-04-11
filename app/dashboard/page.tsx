"use client";
import AppLayout from "@/components/AppLayout";
import { Search } from "lucide-react";

const inp = "w-full border-b border-gray-200 bg-transparent outline-none focus:border-gray-500 py-2 text-sm text-gray-800 placeholder:text-gray-400 transition-colors";

export default function ReaderSettings() {
  return (
    <AppLayout bg="bg-[#F4F4F4]">
      <div className="p-6 max-w-lg">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Welcome, Shaivya</h1>
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-400 w-44">
            <Search size={13}/><span>Search</span>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-8 border border-gray-100">
          <div className="flex flex-col items-center mb-7">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-3xl mb-3">👤</div>
            <p className="font-semibold text-gray-900">Shaivya</p>
            <p className="text-gray-400 text-sm">Reader</p>
          </div>
          <div className="flex flex-col gap-6">
            {[["Full Name","text","Shaivya"],["Email","email","shaivya@email.com"],["Mobile Number","tel","+91 00000 00000"],["Password","password",""]].map(([l,t,v])=>(
              <div key={l as string}>
                <label className="block text-sm text-gray-500 mb-1">{l as string}</label>
                <input type={t as string} defaultValue={v as string} placeholder={t==="password"?"Min. 6 characters":""} className={inp}/>
              </div>
            ))}
          </div>
          <button className="w-full mt-7 py-3 rounded-xl bg-[#F97316] text-white text-sm font-semibold cursor-pointer hover:bg-[#ea6c0a] transition-colors">Save Changes</button>
        </div>
      </div>
    </AppLayout>
  );
}
