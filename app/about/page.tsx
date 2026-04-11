import AppLayout from "@/components/AppLayout";
import { Info } from "lucide-react";
export default function About() {
  return (
    <AppLayout bg="bg-[#F4F4F4]">
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
        <div className="w-20 h-20 rounded-2xl bg-[#111] flex items-center justify-center mb-6"><Info size={36} className="text-white"/></div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">About Stick&Dot.</h1>
        <p className="text-gray-500 text-base mb-2">Humane than AI, faster than human.</p>
        <p className="text-gray-400 text-sm mb-8">Our story and mission are being crafted.</p>
        <span className="inline-block bg-[#111] text-white text-sm font-semibold px-6 py-3 rounded-xl">🚧 Coming Soon</span>
      </div>
    </AppLayout>
  );
}
