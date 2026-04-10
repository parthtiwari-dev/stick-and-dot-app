"use client";

import Link from "next/link";
import AppLayout from "@/components/AppLayout";
import { Search, PlusSquare } from "lucide-react";
import { useState } from "react";

interface InstructionRow {
  id: number;
  value: string;
}

function CreateTasksContent() {
  const [form, setForm] = useState({
    topic: "",
    dueDate: "",
    wordCount: "",
    additionalInstructions: "",
    payment: "",
  });
  const [extraRows, setExtraRows] = useState<InstructionRow[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const set = (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const addRow = () => {
    setExtraRows((prev) => [...prev, { id: Date.now(), value: "" }]);
  };

  const updateRow = (id: number, value: string) => {
    setExtraRows((prev) => prev.map((r) => (r.id === id ? { ...r, value } : r)));
  };

  const handleSubmit = () => {
    if (!form.topic) return;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
    setForm({ topic: "", dueDate: "", wordCount: "", additionalInstructions: "", payment: "" });
    setExtraRows([]);
  };

  return (
    <div className="min-h-screen bg-[#f4f4f4] p-6">
      {/* Breadcrumb + Search */}
      <div className="flex items-center justify-between mb-4">
        <nav className="text-sm text-gray-500">
          <Link href="/dashboard" className="hover:text-black transition-colors">Dashboard</Link>
          <span className="mx-1 text-gray-400">&gt;</span>
          <span className="text-gray-800 font-medium">Create tasks</span>
        </nav>
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-400 w-48">
          <Search size={14} />
          <span>Search</span>
        </div>
      </div>

      {/* Heading */}
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Welcome, Business name</h1>

      {/* Form */}
      <div className="max-w-md space-y-6">
        {/* Topic */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-0.5">Topic</label>
          <p className="text-xs text-gray-400 mb-2">The title that will go as it is</p>
          <input
            type="text"
            value={form.topic}
            onChange={set("topic")}
            className="w-full bg-gray-100 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-gray-300 transition-all"
          />
        </div>

        {/* Due date */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-0.5">Due data</label>
          <p className="text-xs text-gray-400 mb-2">The date of completion</p>
          <input
            type="date"
            value={form.dueDate}
            onChange={set("dueDate")}
            className="w-full bg-gray-100 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-gray-300 transition-all"
          />
        </div>

        {/* Word count */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-0.5">Word count</label>
          <p className="text-xs text-gray-400 mb-2">Words that would be compensated</p>
          <input
            type="number"
            value={form.wordCount}
            onChange={set("wordCount")}
            className="w-full bg-gray-100 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-gray-300 transition-all"
          />
        </div>

        {/* Additional instructions */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-0.5">Additional instructions</label>
          <p className="text-xs text-gray-400 mb-2">Other important instructions to take care of</p>
          <input
            type="text"
            value={form.additionalInstructions}
            onChange={set("additionalInstructions")}
            className="w-full bg-gray-100 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-gray-300 transition-all"
          />
        </div>

        {/* Payment */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-0.5">Payment for the work</label>
          <p className="text-xs text-gray-400 mb-2">Total payment for writer and subject matter expert</p>
          <input
            type="text"
            value={form.payment}
            onChange={set("payment")}
            className="w-full bg-gray-100 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-gray-300 transition-all"
          />
        </div>

        {/* Extra instruction rows */}
        {extraRows.map((row) => (
          <div key={row.id}>
            <label className="block text-sm font-semibold text-gray-900 mb-0.5">Additional instructions</label>
            <p className="text-xs text-gray-400 mb-2">Other important instructions to take care of</p>
            <input
              type="text"
              value={row.value}
              onChange={(e) => updateRow(row.id, e.target.value)}
              className="w-full bg-gray-100 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-gray-300 transition-all"
            />
          </div>
        ))}

        {/* Add more rows */}
        <button
          onClick={addRow}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <PlusSquare size={18} strokeWidth={1.5} className="text-gray-400" />
          Add more rows for instructions
        </button>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          className={`w-full py-3.5 rounded-xl text-white text-sm font-semibold transition-all duration-200 ${
            submitted
              ? "bg-green-600"
              : "bg-[#1f2937] hover:bg-[#374151] active:scale-[0.99]"
          }`}
        >
          {submitted ? "✓ Submitted!" : "Submit"}
        </button>
      </div>
    </div>
  );
}

export default function CreateTasksPage() {
  return (
    <AppLayout>
      <CreateTasksContent />
    </AppLayout>
  );
}
