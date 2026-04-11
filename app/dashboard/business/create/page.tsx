"use client";
import { useState } from "react";
import AppLayout from "@/components/AppLayout";

interface Row { id: number; instructions: string; }

const inp = "w-full border-b border-gray-200 bg-transparent outline-none focus:border-gray-800 py-2 text-sm text-gray-800 placeholder:text-gray-400 transition-colors";

export default function CreateTasks() {
  const [rows, setRows] = useState<Row[]>([{ id: 1, instructions: "" }]);
  const [form, setForm] = useState({ topic: "", dueDate: "", wordCount: "", additionalInstructions: "", payment: "" });
  const [submitted, setSubmitted] = useState(false);

  const addRow = () => setRows(p => [...p, { id: Date.now(), instructions: "" }]);
  const removeRow = (id: number) => setRows(p => p.filter(r => r.id !== id));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: POST /api/tasks/create { ...form, rows }
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <AppLayout>
      <div className="p-6 max-w-2xl">
        <p className="text-xs text-gray-400 mb-0.5">Dashboard&gt;Create tasks</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Welcome, Business name</h1>

        <div className="bg-white rounded-2xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="flex flex-col gap-7">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Topic</label>
              <p className="text-xs text-gray-400 mb-2">The title that will go on the article</p>
              <input type="text" value={form.topic} onChange={e => setForm(p=>({...p,topic:e.target.value}))} className={inp} placeholder="Enter article topic…"/>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Due data</label>
              <p className="text-xs text-gray-400 mb-2">The date of completion</p>
              <input type="date" value={form.dueDate} onChange={e => setForm(p=>({...p,dueDate:e.target.value}))} className={inp}/>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Word count</label>
              <p className="text-xs text-gray-400 mb-2">Words that would be comprehensive to</p>
              <input type="number" value={form.wordCount} onChange={e => setForm(p=>({...p,wordCount:e.target.value}))} className={inp} placeholder="e.g. 1500"/>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Additional instructions</label>
              <p className="text-xs text-gray-400 mb-2">Other important instructions to take care of</p>
              <input type="text" value={form.additionalInstructions} onChange={e => setForm(p=>({...p,additionalInstructions:e.target.value}))} className={inp} placeholder="Add any special requirements…"/>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Payment for the work</label>
              <p className="text-xs text-gray-400 mb-2">Total payment for writer and subject matter expert</p>
              <input type="text" value={form.payment} onChange={e => setForm(p=>({...p,payment:e.target.value}))} className={inp} placeholder="Rs. XXXX"/>
            </div>

            {/* Extra rows */}
            {rows.slice(1).map(row => (
              <div key={row.id} className="flex items-end gap-2">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Additional Row</label>
                  <input type="text" value={row.instructions} onChange={e => setRows(p => p.map(r => r.id===row.id ? {...r,instructions:e.target.value} : r))} className={inp} placeholder="Additional instruction…"/>
                </div>
                <button type="button" onClick={() => removeRow(row.id)} className="text-gray-400 hover:text-red-500 transition-colors pb-2 cursor-pointer">✕</button>
              </div>
            ))}

            <button type="button" onClick={addRow}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors cursor-pointer w-fit">
              <span className="w-5 h-5 rounded border border-gray-400 flex items-center justify-center text-lg leading-none">+</span>
              Add more rows for instructions
            </button>

            <button type="submit"
              className="w-48 py-3 rounded-xl bg-[#111] text-white text-sm font-semibold hover:bg-[#333] transition-all cursor-pointer">
              {submitted ? "Task Created! ✓" : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
