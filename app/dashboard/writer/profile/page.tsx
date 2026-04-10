"use client";

import Link from "next/link";
import AppLayout from "@/components/AppLayout";
import { Search, ChevronDown } from "lucide-react";
import { useState } from "react";

/* ── Mock writer data ── */
const WRITERS = [
  { name: "Daffa Naufal",  role: "Ceo at Google",    email: "daffanaufal@gmail.com",    phone: "+6212345678",  id: "GGL - 001" },
  { name: "Shakir Ramzi",  role: "Ceo at Garena",    email: "shakirramzi@gmail.com",    phone: "+6223467890",  id: "GRN - 002" },
  { name: "Zara Annisa",   role: "Ceo at Bukalapak", email: "annisazara@gmail.com",     phone: "+6234567890",  id: "BKL - 003" },
  { name: "Chris Evans",   role: "Ceo at Amazon",    email: "chrisevans@gmail.com",     phone: "+6245678901",  id: "AMZ - 004" },
  { name: "Jack Miller",   role: "Ceo at Dana",      email: "jackmiller@gmail.com",     phone: "+6256789012",  id: "DAN - 005" },
  { name: "Richard Kyle",  role: "Ceo at Bibit",     email: "ricardkyle@gmail.com",     phone: "+6267890123",  id: "BIT - 006" },
  { name: "John Wich",     role: "Ceo at Shopee",    email: "johnwhich@gmail.com",      phone: "+627890123",   id: "SHP - 007" },
  { name: "Brian Dawn",    role: "Ceo at Lazada",    email: "briandawn@gmail.com",      phone: "+6289012345",  id: "LZD - 008" },
  { name: "James Wayn",    role: "Ceo at Gojek",     email: "jameswayn@gmail.com",      phone: "+6290123456",  id: "GJK - 009" },
];

const AVATAR_COLORS = [
  "bg-orange-500","bg-gray-600","bg-red-500","bg-blue-600","bg-orange-400",
  "bg-gray-500","bg-green-600","bg-purple-500","bg-yellow-600",
];

function Avatar({ name, color }: { name: string; color: string }) {
  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0 ${color}`}>
      {name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
    </div>
  );
}

function ProfileContent() {
  const [page, setPage] = useState(1);

  return (
    <div className="min-h-screen bg-[#f4f4f4] p-6">
      {/* Breadcrumb + Search */}
      <div className="flex items-center justify-between mb-4">
        <nav className="text-sm text-gray-500">
          <Link href="/dashboard/writer" className="hover:text-black transition-colors">Dashboard</Link>
          <span className="mx-1 text-gray-400">&gt;</span>
          <span className="text-gray-800 font-medium">Profile</span>
        </nav>
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-400 w-48">
          <Search size={14} />
          <span>Search</span>
        </div>
      </div>

      {/* Heading */}
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Welcome, Shaivya</h1>

      {/* Two-column layout */}
      <div className="flex gap-5">
        {/* Left — Profile card */}
        <div className="w-[320px] shrink-0 bg-white rounded-2xl p-6 flex flex-col">
          {/* Avatar */}
          <div className="flex justify-center mb-4">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-orange-100 flex items-center justify-center">
              <svg viewBox="0 0 96 96" className="w-full h-full">
                <circle cx="48" cy="48" r="48" fill="#f97316" />
                <ellipse cx="48" cy="38" rx="18" ry="20" fill="#fde68a" />
                <ellipse cx="48" cy="80" rx="26" ry="20" fill="#1f2937" />
                <ellipse cx="35" cy="34" rx="6" ry="8" fill="#f97316" />
                <ellipse cx="61" cy="34" rx="6" ry="8" fill="#f97316" />
                <circle cx="43" cy="38" r="3" fill="#1f2937" />
                <circle cx="53" cy="38" r="3" fill="#1f2937" />
                <path d="M43 46 Q48 50 53 46" stroke="#1f2937" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          <div className="text-center mb-5">
            <p className="font-semibold text-gray-900 text-sm">Richard Tyson</p>
            <p className="text-xs text-gray-500">Ceo at Tokopedia</p>
            <p className="text-xs text-gray-500 mt-0.5">Employees ID : CLT - 001</p>
          </div>

          {/* Details */}
          <div className="space-y-3 text-xs mb-5">
            {[
              { label: "Phone",   value: "+6281325132288" },
              { label: "Email",   value: "richardtyson@gmail.com" },
              { label: "Address", value: "Merdeka Street, Wonosobo" },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-start gap-2">
                <span className="text-gray-400 w-16 shrink-0">{label}</span>
                <span className="text-gray-400">:</span>
                <span className="text-gray-700">{value}</span>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="mb-5">
            <p className="text-xs font-semibold text-gray-800 mb-1">Description</p>
            <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">
              I&apos;m the CEO at Tokopedia. Establishing an application myself is my goal. I want to help ...
            </p>
          </div>

          <button className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors mt-auto">
            Edit Details
          </button>
        </div>

        {/* Right — Our writers table */}
        <div className="flex-1 bg-white rounded-2xl p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">Our writers</h2>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 border border-gray-200 text-gray-600 text-xs px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                All Data <ChevronDown size={12} />
              </button>
              <button className="flex items-center gap-1.5 border border-gray-200 text-gray-600 text-xs px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                August <ChevronDown size={12} />
              </button>
            </div>
          </div>

          {/* Table header */}
          <div className="grid grid-cols-4 text-xs text-gray-400 font-medium pb-2 border-b border-gray-100 mb-1">
            <span>Name</span>
            <span>Email</span>
            <span>Phone Number</span>
            <span>Employees ID</span>
          </div>

          {/* Rows */}
          <div className="flex-1">
            {WRITERS.map((writer, i) => (
              <div
                key={writer.id}
                className="grid grid-cols-4 items-center py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors rounded-lg px-1"
              >
                <div className="flex items-center gap-2.5">
                  <Avatar name={writer.name} color={AVATAR_COLORS[i]} />
                  <div>
                    <p className="text-xs font-semibold text-gray-800">{writer.name}</p>
                    <p className="text-[10px] text-gray-400">{writer.role}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">{writer.email}</span>
                <span className="text-xs text-gray-500">{writer.phone}</span>
                <span className="text-xs text-gray-500">{writer.id}</span>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between pt-4 mt-2 border-t border-gray-100">
            <span className="text-xs text-gray-400">Showing 1 to 9 of 90 entries</span>
            <div className="flex items-center gap-1">
              <button className="text-xs text-gray-400 px-2 py-1 hover:text-gray-700 transition-colors">Previous</button>
              {[1, 2].map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${
                    page === p ? "bg-orange-500 text-white" : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button className="text-xs text-gray-400 px-2 py-1 hover:text-gray-700 transition-colors">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardProfilePage() {
  return (
    <AppLayout>
      <ProfileContent />
    </AppLayout>
  );
}
