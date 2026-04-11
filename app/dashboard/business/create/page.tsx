"use client";
import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

interface Instruction { id: number; value: string; }

export default function CreateTask() {
  const [topic, setTopic] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [wordCount, setWordCount] = useState("");
  const [payment, setPayment] = useState("");
  const [instructions, setInstructions] = useState<Instruction[]>([{ id: 1, value: "" }]);

  const addRow = () => setInstructions(p => [...p, { id: Date.now(), value: "" }]);
  const updateRow = (id: number, val: string) =>
    setInstructions(p => p.map(i => i.id === id ? { ...i, value: val } : i));

  const inp = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-gray-400 bg-white placeholder:text-gray-300 transition-colors";

  return (
    <AppLayout bg="bg-[#F4F4F4]">
      <div className="p-4 md:p-6 max-w-2xl">
        <p className="text-xs text-gray-400 mb-1">
          <Link href="/dashboard/business" className="hover:text-gray-700">Dashboard</Link>
          &gt;Create Tasks
        </p>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Welcome, Business name</h1>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 flex flex-col gap-5">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Topic</label>
            <p className="text-xs text-gray-400 mb-2">Pick the the subject to</p>
            <input type="text" value={topic} onChange={e => setTopic(e.target.value)}
              placeholder="Article topic…" className={inp} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Due date</label>
            <p className="text-xs text-gray-400 mb-2">The date of completion is</p>
            <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)}
              className={inp} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Word count</label>
            <p className="text-xs text-gray-400 mb-2">Words that should be compromised</p>
            <input type="number" value={wordCount} onChange={e => setWordCount(e.target.value)}
              placeholder="e.g. 1500" className={inp} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Additional instructions</label>
            <p className="text-xs text-gray-400 mb-2">Other important factors/keywords/context</p>
            {instructions.map(inst => (
              <input key={inst.id} type="text" value={inst.value}
                onChange={e => updateRow(inst.id, e.target.value)}
                placeholder="Add instruction…" className={`${inp} mb-2`} />
            ))}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Payment for the work</label>
            <p className="text-xs text-gray-400 mb-2">Total payment for writer and subject matter expert</p>
            <input type="text" value={payment} onChange={e => setPayment(e.target.value)}
              placeholder="₹ or $" className={inp} />
          </div>

          <button onClick={addRow}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 cursor-pointer transition-colors w-fit">
            <PlusCircle size={16} />Add more rows for instructions
          </button>

          <button className="w-full py-4 bg-[#111] text-white rounded-xl text-sm font-semibold hover:bg-[#333] transition-colors cursor-pointer mt-2">
            Submit
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
