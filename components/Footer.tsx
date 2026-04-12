import Link from "next/link";
import Logo from "@/components/Logo";

const EXPLORE = ["Dashboard","About Us","Our Team","Contact us"];
const BLOGS   = ["Newsroom","Lorem Ipsum","Lorem Ipsum","Downloads"];
const FOLLOW  = ["Instagram","Twitter","Linkedin","Dribbble"];

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] text-white mt-0">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-6 grid grid-cols-2 md:grid-cols-4 gap-5 items-start">
        {/* Logo */}
        <div className="px-5 pb-2">
          <Logo size="sm" theme="dark" />
        </div>
        {/* Explore */}
        <div className="md:border-l md:border-gray-600 md:pl-8">
          <p className="font-semibold text-sm mb-3">Explore</p>
          {EXPLORE.map((l,i) => (
            <Link key={i} href="#" className="block text-sm text-gray-400 hover:text-white mb-1.5 transition-colors">{l}</Link>
          ))}
        </div>
        {/* Blogs */}
        <div className="md:border-l md:border-gray-600 md:pl-8">
          <p className="font-semibold text-sm mb-3">Blogs</p>
          {BLOGS.map((l,i) => (
            <Link key={i} href="#" className="block text-sm text-gray-400 hover:text-white mb-1.5 transition-colors">{l}</Link>
          ))}
        </div>
        {/* Follow */}
        <div className="md:border-l md:border-gray-600 md:pl-8">
          <p className="font-semibold text-sm mb-3">Follow</p>
          {FOLLOW.map((l,i) => (
            <Link key={i} href="#" className="block text-sm text-gray-400 hover:text-white mb-1.5 transition-colors">{l}</Link>
          ))}
        </div>
      </div>
      <div className="border-t border-gray-700 py-4 text-center text-xs text-gray-500">
        © 2026 Designed By Parth Tiwari
      </div>
    </footer>
  );
}
