"use client";
import Link from "next/link";
import AppLayout from "@/components/AppLayout";
import { Search } from "lucide-react";

export default function ProfilePage() {
  return (
    <AppLayout>
      <div className="min-h-screen bg-[#f4f4f4] p-6">
        <div className="flex items-center justify-between mb-4">
          <nav className="text-sm text-gray-500">
            <Link href="/dashboard/subject-expert" className="hover:text-black">Dashboard</Link>
            <span className="mx-1">&gt;</span>
            <span className="text-gray-800 font-medium">Profile</span>
          </nav>
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-400 w-48">
            <Search size={14} /><span>Search</span>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Welcome, Shaivya</h1>
        <div className="bg-white rounded-2xl p-8 max-w-md">
          <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 rounded-full bg-gray-200 mb-3 flex items-center justify-center text-3xl">👤</div>
            <p className="font-semibold text-gray-900">Richard Tyson</p>
            <p className="text-sm text-gray-500">Profile details</p>
          </div>
          <button className="w-full py-3 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors">Edit Details</button>
        </div>
      </div>
    </AppLayout>
  );
}
