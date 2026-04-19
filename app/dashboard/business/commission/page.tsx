"use client";
import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

const DOMAINS = ["Technology","Finance","Medical / Health","Law","Science","Business","Education","Culture","Other"];

const ACTIVE_ORDERS = [
  { topic:"The Future of EVs in India",         writer:"Ravi M.",    status:"In Progress",       deadline:"Apr 20", payment:"₹4,500", statusColor:"text-blue-500"   },
  { topic:"Top 10 Finance Hacks for Gen-Z",     writer:"—",          status:"Open",              deadline:"Apr 24", payment:"₹3,200", statusColor:"text-gray-400"   },
  { topic:"AI in Healthcare: What Doctors Say", writer:"Priya K.",   status:"Under SME Review",  deadline:"Apr 30", payment:"₹6,000", statusColor:"text-orange-500" },
  { topic:"Sustainable Fashion on a Budget",    writer:"Sara T.",    status:"Delivered",         deadline:"May 5",  payment:"₹2,800", statusColor:"text-green-500"  },
];

interface Instruction { id: number; value: string; }

export default function BusinessCommission() {
  const [topic, setTopic]       = useState("");
  const [domain, setDomain]     = useState("");
  const [dueDate, setDueDate]   = useState("");
  const [wordCount, setWordCount] = useState("");
  const [payment, setPayment]   = useState("");
  const [instructions, setInstructions] = useState<Instruction[]>([{ id: 1, value: "" }]);

  const addRow    = () => setInstructions(p => [...p, { id: Date.now(), value: "" }]);
  const updateRow = (id: number, val: string) =>
    setInstructions(p => p.map(i => i.id === id ? { ...i, value: val } : i));

  const inp = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-gray-400 bg-white placeholder:text-gray-300 transition-colors";

  return (
    <AppLayout bg="bg-[#F4F4F4]">
      <div className="p-4 md:p-6">
        <p className="text-xs text-gray-400 mb-1">
          <Link href="/dashboard/business" className="hover:text-gray-700">Dashboard</Link>
          &gt;Commission
        </p>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Post a Commission</h1>

        {/* Create Commission Form */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 flex flex-col gap-5 mb-8 max-w-2xl">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Topic</label>
            <p className="text-xs text-gray-400 mb-2">The subject of the article you need</p>
            <input type="text" value={topic} onChange={e => setTopic(e.target.value)}
              placeholder="e.g. The Future of Renewable Energy in India" className={inp}/>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Domain</label>
            <p className="text-xs text-gray-400 mb-2">Which field does this article belong to?</p>
            <select value={domain} onChange={e => setDomain(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-gray-400 bg-white cursor-pointer">
              <option value="">Select a domain…</option>
              {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">Due Date</label>
              <p className="text-xs text-gray-400 mb-2">Deadline for delivery</p>
              <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className={inp}/>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">Word Count</label>
              <p className="text-xs text-gray-400 mb-2">Target article length</p>
              <input type="number" value={wordCount} onChange={e => setWordCount(e.target.value)}
                placeholder="e.g. 1500" className={inp}/>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Additional Instructions</label>
            <p className="text-xs text-gray-400 mb-2">Keywords, tone, references, or context</p>
            {instructions.map(inst => (
              <input key={inst.id} type="text" value={inst.value}
                onChange={e => updateRow(inst.id, e.target.value)}
                placeholder="Add instruction…" className={`${inp} mb-2`}/>
            ))}
            <button onClick={addRow}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 cursor-pointer transition-colors w-fit mt-1">
              <PlusCircle size={16}/>Add more instructions
            </button>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Payment Offered</label>
            <p className="text-xs text-gray-400 mb-2">Total amount for writer + SME review</p>
            <input type="text" value={payment} onChange={e => setPayment(e.target.value)}
              placeholder="e.g. ₹4,500 or $60" className={inp}/>
          </div>

          <button className="w-full py-4 bg-[#111] text-white rounded-xl text-sm font-semibold hover:bg-[#333] transition-colors cursor-pointer mt-2">
            Post Commission
          </button>
        </div>

        {/* Active Orders Tracker */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-base font-semibold text-gray-900">Active Orders</p>
              <p className="text-xs text-gray-400 mt-0.5">Track the status of all your commissioned articles</p>
            </div>
            <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg">{ACTIVE_ORDERS.length} Orders</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Topic","Writer","Status","Deadline","Payment"].map(h => (
                    <th key={h} className="text-xs text-gray-400 font-medium pb-3 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ACTIVE_ORDERS.map((o, i) => (
                  <tr key={i} className="border-b border-gray-50 last:border-0">
                    <td className="py-3 text-sm text-gray-800 font-medium max-w-[220px]">{o.topic}</td>
                    <td className="py-3 text-sm text-gray-500">{o.writer}</td>
                    <td className="py-3">
                      <span className={`text-xs font-semibold ${o.statusColor}`}>{o.status}</span>
                    </td>
                    <td className="py-3 text-sm text-gray-500">{o.deadline}</td>
                    <td className="py-3 text-sm text-gray-700 font-semibold">{o.payment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
