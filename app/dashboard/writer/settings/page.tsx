"use client";
import AppLayout from "@/components/AppLayout";
import { Search } from "lucide-react";

const CLIENTS = [
  { name:"Daffa Naufal", role:"Ceo at Google",    email:"daffanaufal@gmail.com",  phone:"+6212345678",  id:"GGL-001" },
  { name:"Shakir Ramzi", role:"Ceo at Garena",    email:"shakirramzi@gmail.com",  phone:"+6223467890",  id:"GRN-002" },
  { name:"Zara Annisa",  role:"Ceo at Bukalapak", email:"annisasara@gmail.com",   phone:"+6234567890",  id:"BKL-003" },
  { name:"Chris Evans",  role:"Ceo at Amazon",    email:"chrisevans@gmail.com",   phone:"+6245678901",  id:"AMZ-004" },
  { name:"Jack Miller",  role:"Ceo at Dana",      email:"jackmiller@gmail.com",   phone:"+6256789012",  id:"DAN-005" },
  { name:"Richard Kyle", role:"Ceo at Bibit",     email:"ricardkyle@gmail.com",   phone:"+6267890123",  id:"BIT-006" },
  { name:"John Wich",    role:"Ceo at Shopee",    email:"johnwhich@gmail.com",    phone:"+627890123",   id:"SHP-007" },
  { name:"Brian Dawn",   role:"Ceo at Lazada",    email:"briandawn@gmail.com",    phone:"+6289012345",  id:"LZD-008" },
  { name:"James Wayn",   role:"Ceo at Gojek",     email:"jameswayn@gmail.com",    phone:"+6290123456",  id:"GJK-009" },
];

const row = (l: string, v: string) => (
  <div key={l} className="flex items-start gap-2 py-1.5 border-b border-gray-50 last:border-0">
    <span className="text-gray-500 text-xs w-16 flex-shrink-0">{l}</span>
    <span className="text-gray-400 text-xs">:</span>
    <span className="text-gray-700 text-xs">{v}</span>
  </div>
);

export default function WriterSettings() {
  return (
    <AppLayout bg="bg-[#F4F4F4]">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Welcome, Shaivya</h1>
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-400 w-44">
            <Search size={13}/><span>Search</span>
          </div>
        </div>
        <div className="flex gap-5">
          {/* Left */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100" style={{minWidth:280,maxWidth:300}}>
            <p className="text-sm font-semibold text-gray-800 mb-0.5">Clients Now</p>
            <p className="text-xs text-gray-400 mb-5">Give the best service to get him to subscribe</p>
            <div className="flex flex-col items-center mb-5">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-4xl mb-3 overflow-hidden">
                <span>👤</span>
              </div>
              <p className="text-gray-900 font-semibold text-base">Richard Tyson</p>
              <p className="text-gray-500 text-sm">Ceo at Tokopedia</p>
              <p className="text-gray-500 text-sm">Employees ID : CLT - 001</p>
            </div>
            <div className="space-y-0.5 mb-4">
              {row("Phone", "+6281325132288")}
              {row("Email", "richardtyson@gmail.com")}
              {row("Address", "Merdeka Street, Wonosobo")}
              {row("Password", "•••••••")}
              {row("Bank", "•••••••")}
              {row("IIFSC code", "•••••••")}
            </div>
            <p className="text-sm font-semibold text-gray-800 mb-2 mt-3">Description</p>
            <p className="text-xs text-gray-400 leading-relaxed mb-5">I&apos;m the CEO at Tokopedia. Establishing an application myself to my goal, I want to help…</p>
            <button className="w-full py-3 rounded-xl bg-[#F97316] text-white text-sm font-semibold cursor-pointer hover:bg-[#ea6c0a] transition-colors">
              Edit Details
            </button>
          </div>

          {/* Right — My Clients table */}
          <div className="flex-1 bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-5">
              <p className="text-gray-900 text-base font-semibold">My Clients</p>
              <div className="flex gap-2">
                <select className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 outline-none text-gray-600 bg-white cursor-pointer"><option>All Data</option></select>
                <select className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 outline-none text-gray-600 bg-white cursor-pointer"><option>August</option></select>
              </div>
            </div>
            <table className="w-full">
              <thead>
                <tr>
                  {["Name","Email","Phone Number","Employees ID"].map(h=>(
                    <th key={h} className="text-xs text-gray-400 font-medium pb-3 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CLIENTS.map(c=>(
                  <tr key={c.id} className="border-t border-gray-50">
                    <td className="py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-300 to-orange-600 flex items-center justify-center text-white text-xs font-bold overflow-hidden">
                          {c.name[0]}
                        </div>
                        <div>
                          <p className="text-sm text-gray-800 font-medium leading-tight">{c.name}</p>
                          <p className="text-xs text-gray-400">{c.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-sm text-gray-500">{c.email}</td>
                    <td className="py-3 text-sm text-gray-500">{c.phone}</td>
                    <td className="py-3 text-sm text-gray-500">{c.id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400">Showing 1 to 9 of 90 entries</p>
              <div className="flex gap-1">
                <button className="text-xs text-gray-400 px-3 py-1 rounded-lg hover:bg-gray-100 cursor-pointer">Previous</button>
                <button className="text-xs bg-[#F97316] text-white px-3 py-1 rounded-lg cursor-pointer">1</button>
                <button className="text-xs text-gray-400 px-3 py-1 rounded-lg hover:bg-gray-100 cursor-pointer">2</button>
                <button className="text-xs text-gray-400 px-3 py-1 rounded-lg hover:bg-gray-100 cursor-pointer">Next</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
