"use client";
import AppLayout from "@/components/AppLayout";
import Link from "next/link";
import { Rocket } from "lucide-react";

export default function SubjectExpertDashboard() {
  return (
    <AppLayout bg="bg-[#F4F4F4]">
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
        <div className="w-20 h-20 rounded-2xl bg-[#111] flex items-center justify-center mb-6">
          <Rocket size={36} className="text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Subject Expert Dashboard</h1>
        <p className="text-gray-500 text-base mb-2">This dashboard is currently under construction.</p>
        <p className="text-gray-400 text-sm mb-8">We&apos;re working hard to bring you an amazing experience.</p>
        <span className="inline-block bg-[#111] text-white text-sm font-semibold px-6 py-3 rounded-xl">
          🚧 Coming Soon
        </span>
        <Link href="/dashboard/subject-expert/settings" className="mt-4 text-sm text-gray-400 hover:text-gray-700 underline">
          Go to Settings
        </Link>
      </div>
    </AppLayout>
  );
}
