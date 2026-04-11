"use client";
import AppLayout from "@/components/AppLayout";
import Link from "next/link";
import { Search, Plus, Clock, CheckCircle, AlertCircle } from "lucide-react";

const COMMISSIONS = [
  { id: "COM-001", topic: "AI in Healthcare — 2000 words", writer: "Arthur Black",   deadline: "20 Apr 2026", budget: "₹4,500", status: "In Progress" },
  { id: "COM-002", topic: "Sustainable Fashion Trends",    writer: "Shaivya Saini",  deadline: "22 Apr 2026", budget: "₹3,200", status: "Pending Review" },
  { id: "COM-003", topic: "Crypto Market Analysis Q2",     writer: "Jerome Bell",    deadline: "18 Apr 2026", budget: "₹6,000", status: "Completed" },
  { id: "COM-004", topic: "Remote Work Productivity Tips", writer: "Priya Mehta",    deadline: "25 Apr 2026", budget: "₹2,800", status: "In Progress" },
  { id: "COM-005", topic: "Electric Vehicle Landscape",    writer: "Unassigned",     deadline: "28 Apr 2026", budget: "₹5,500", status: "Open" },
  { id: "COM-006", topic: "SaaS Growth Playbook 2026",     writer: "Arthur Black",   deadline: "30 Apr 2026", budget: "₹7,000", status: "Pending Review" },
];

const STATUS_STYLE: Record<string, string> = {
  "In Progress":    "bg-blue-50 text-blue-600",
  "Pending Review": "bg-yellow-50 text-yellow-600",
  "Completed":      "bg-green-50 text-green-600",
  "Open":           "bg-gray-100 text-gray-500",
};

const STATS = [
  { label: "Active Commissions", value: "2",    icon: <Clock size={18} className="text-blue-500" /> },
  { label: "Pending Review",     value: "2",    icon: <AlertCircle size={18} className="text-yellow-500" /> },
  { label: "Completed",          value: "1",    icon: <CheckCircle size={18} className="text-green-500" /> },
  { label: "Total Spent",        value: "₹13.7k", icon: <span className="text-base">🪙</span> },
];

export default function LeadsPage() {
  return (
    <AppLayout bg="bg-[#F4F4F4]">
      <div className="p-4 md:p-6 min-h-screen">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Dashboard&gt;Leads</p>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">My Commissions</h1>
            <p className="text-sm text-gray-500">Track and manage your content orders</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-400 w-44">
              <Search size={13} /><span>Search</span>
            </div>
            <Link href="/dashboard/business/create">
              <button className="flex items-center gap-2 bg-[#111] text-white text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-[#333] transition-colors cursor-pointer">
                <Plus size={14} />New Commission
              </button>
            </Link>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {STATS.map(s => (
            <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100">
              <div className="flex items-center gap-2 mb-2">{s.icon}<span className="text-xs text-gray-400">{s.label}</span></div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Commission table */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-800">All Commissions</p>
            <select className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 outline-none text-gray-600 bg-white cursor-pointer">
              <option>All Status</option>
              <option>In Progress</option>
              <option>Pending Review</option>
              <option>Completed</option>
              <option>Open</option>
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-gray-100">
                  {["ID", "Topic", "Writer", "Deadline", "Budget", "Status"].map(h => (
                    <th key={h} className="text-xs text-gray-400 font-medium py-3 px-5 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMMISSIONS.map(c => (
                  <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-3.5 px-5 text-xs text-gray-400 font-mono">{c.id}</td>
                    <td className="py-3.5 px-5 text-sm text-gray-800 font-medium max-w-[220px]">{c.topic}</td>
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-300 to-orange-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {c.writer[0]}
                        </div>
                        <span className="text-sm text-gray-600">{c.writer}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 text-sm text-gray-500">{c.deadline}</td>
                    <td className="py-3.5 px-5 text-sm font-semibold text-gray-800">{c.budget}</td>
                    <td className="py-3.5 px-5">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLE[c.status]}`}>
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
            <p className="text-xs text-gray-400">Showing 1–6 of 6 commissions</p>
            <div className="flex gap-1">
              <button className="text-xs text-gray-400 px-3 py-1 rounded-lg hover:bg-gray-100 cursor-pointer">Previous</button>
              <button className="text-xs bg-[#111] text-white px-3 py-1 rounded-lg cursor-pointer">1</button>
              <button className="text-xs text-gray-400 px-3 py-1 rounded-lg hover:bg-gray-100 cursor-pointer">Next</button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
