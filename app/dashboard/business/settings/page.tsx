"use client";
import AppLayout from "@/components/AppLayout";
import { Search } from "lucide-react";

const WRITERS = [
  { name: "Daffa Naufal", role: "Ceo at Google",    email: "daffanaufal@gmail.com",  phone: "+621234S678", id: "GGL-001" },
  { name: "Shakir Ramd", role: "Ceo at Garena",     email: "shakirrama@gmail.com",   phone: "+622346789O", id: "GRN-002" },
  { name: "Zara Annisa", role: "Ceo at Ruangkupak", email: "annisazara@gmail.com",   phone: "+623456789O", id: "BRL-003" },
  { name: "Chris Evans", role: "Ceo at Amazon",     email: "chrisevans@gmail.com",   phone: "+624567890I", id: "AMZ-004" },
  { name: "Jack Miller", role: "Ceo at Deta",       email: "jackmiller@gmail.com",   phone: "+625678901 2", id: "DAN-005" },
  { name: "Richard Kyle", role: "Ceo at Bit",       email: "richardkyle@gmail.com",  phone: "+626789012 3", id: "BIT-006" },
  { name: "John Wich",   role: "Ship Designer",     email: "johnwich@gmail.com",     phone: "+627890123", id: "SHP-007" },
  { name: "Brian Dawn",  role: "Ceo at Leeds",      email: "briandawn@gmail.com",    phone: "+628901234 5", id: "LZB-008" },
  { name: "James Wayn",  role: "Ceo at Oqie",       email: "jameswayn@gmail.com",    phone: "+629012345 6", id: "QJK-009" },
];

const inp = "w-full border-b border-gray-200 bg-transparent outline-none focus:border-gray-500 py-1.5 text-sm text-gray-800 placeholder:text-gray-400 transition-colors";

export default function BusinessSettings() {
  return (
    <AppLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Dashboard&gt;Profile</p>
            <h1 className="text-2xl font-bold text-gray-900">Welcome, Shaivya</h1>
          </div>
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-400 w-44">
            <Search size={13}/><span>Search</span>
          </div>
        </div>

        <div className="flex gap-5">
          <div style={{minWidth:260}}>
            <div className="bg-white rounded-2xl p-5 border border-gray-100">
              <p className="text-sm font-semibold text-gray-700 mb-1">Clients Now</p>
              <p className="text-xs text-gray-400 mb-4">Give the best service to get them to subscribe</p>
              <div className="flex flex-col items-center mb-5">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-2xl mb-2">👤</div>
                <p className="text-gray-900 font-semibold text-sm">Richard Tyson</p>
                <p className="text-gray-400 text-xs">Ceo at Tokopedia</p>
                <p className="text-gray-400 text-xs">Employee ID: CLT-001</p>
              </div>
              <div className="flex flex-col gap-4">
                {[["Phone","+628102512288","tel"],["Email","richardtyson@gmail.com","email"],["Address","Merdeka Street, Wonosobo","text"]].map(([l,v,t]) => (
                  <div key={l as string}>
                    <label className="text-xs text-gray-400 block mb-1">{l as string}</label>
                    <input type={t as string} defaultValue={v as string} className={inp}/>
                  </div>
                ))}
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Description</label>
                  <textarea defaultValue="An active Tokopedia data kelebihan application myself to my goal, I want to help." rows={3} className="w-full border-b border-gray-200 bg-transparent outline-none text-xs text-gray-600 resize-none"/>
                </div>
              </div>
              <button className="w-full mt-5 py-2.5 rounded-xl bg-[#F97316] text-white text-sm font-semibold cursor-pointer hover:bg-[#ea6c0a] transition-colors">Edit Details</button>
            </div>
          </div>

          <div className="flex-1">
            <div className="bg-white rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-900 text-sm font-semibold">Our writers</p>
                <div className="flex gap-2">
                  <select className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 outline-none text-gray-600 cursor-pointer"><option>All Data</option></select>
                  <select className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 outline-none text-gray-600 cursor-pointer"><option>August</option></select>
                </div>
              </div>
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-xs text-gray-400 font-medium pb-3 text-left">Name</th>
                    <th className="text-xs text-gray-400 font-medium pb-3 text-left">Email</th>
                    <th className="text-xs text-gray-400 font-medium pb-3 text-left">Phone Number</th>
                    <th className="text-xs text-gray-400 font-medium pb-3 text-left">Employee ID</th>
                  </tr>
                </thead>
                <tbody>
                  {WRITERS.map(w => (
                    <tr key={w.id} className="border-t border-gray-50">
                      <td className="py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-300 to-orange-500 flex items-center justify-center text-white text-xs font-bold">{w.name[0]}</div>
                          <div><p className="text-sm text-gray-800 font-medium">{w.name}</p><p className="text-xs text-gray-400">{w.role}</p></div>
                        </div>
                      </td>
                      <td className="py-2.5 text-xs text-gray-500">{w.email}</td>
                      <td className="py-2.5 text-xs text-gray-500">{w.phone}</td>
                      <td className="py-2.5 text-xs text-gray-500">{w.id}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-400">Showing 9 out of 18 entries</p>
                <div className="flex gap-1">
                  <button className="text-xs text-gray-400 px-3 py-1 rounded-lg hover:bg-gray-100 cursor-pointer">Previous</button>
                  <button className="text-xs bg-[#111] text-white px-3 py-1 rounded-lg cursor-pointer">1</button>
                  <button className="text-xs text-gray-400 px-3 py-1 rounded-lg hover:bg-gray-100 cursor-pointer">2</button>
                  <button className="text-xs text-gray-400 px-3 py-1 rounded-lg hover:bg-gray-100 cursor-pointer">Next</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
