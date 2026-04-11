import AppLayout from "@/components/AppLayout";
import { Users } from "lucide-react";
export default function Community() {
  return (
    <AppLayout bg="bg-[#F4F4F4]">
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
        <div className="w-20 h-20 rounded-2xl bg-[#111] flex items-center justify-center mb-6"><Users size={36} className="text-white"/></div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Community</h1>
        <p className="text-gray-400 text-sm mb-8">Connect with writers, readers, and experts.</p>
        <span className="inline-block bg-[#111] text-white text-sm font-semibold px-6 py-3 rounded-xl">🚧 Coming Soon</span>
      </div>
    </AppLayout>
  );
}
