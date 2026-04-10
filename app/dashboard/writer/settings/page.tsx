"use client";

import Link from "next/link";
import AppLayout from "@/components/AppLayout";
import { Search } from "lucide-react";

export default function WriterSettingsPage() {
  return (
    <AppLayout>
      <div className="min-h-screen bg-[#f4f4f4] p-6">
        <div className="flex items-center justify-between mb-4">
          <nav className="text-sm text-gray-500">
            <Link href="/dashboard/writer" className="hover:text-black">Dashboard</Link>
            <span className="mx-1">&gt;</span>
            <span className="text-gray-800 font-medium">Settings</span>
          </nav>
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-400 w-48">
            <Search size={14} /><span>Search</span>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Welcome, Shaivya</h1>
        <div className="bg-white rounded-2xl p-8 max-w-lg">
          <h2 className="text-base font-semibold mb-6">Account Settings</h2>
          <div className="space-y-5">
            {["Display Name","Email","Bio","Notification preferences"].map((field) => (
              <div key={field}>
                <label className="block text-xs text-gray-500 mb-1">{field}</label>
                <div className="w-full border-b border-gray-200 py-2 text-sm text-gray-400">—</div>
              </div>
            ))}
          </div>
          <button className="mt-8 w-full py-3 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
