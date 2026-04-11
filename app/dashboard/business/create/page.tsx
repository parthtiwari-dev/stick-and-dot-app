"use client";
import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { PlusSquare } from "lucide-react";

interface Row { id: number; value: string; }
const inp = "w-full bg-gray-100 rounded-lg px-4 py-2.5 text-sm text-gray-700 outline-none focus:bg-gray-200 transition-colors placeholder:text-gray-400";

export default function CreateTasks() {
  const [form, setForm] = useState({ topic:"", dueDate:"", wordCount:"", additional:"", payment:"" });
  const [rows, setRows] = useState<Row[]>([]);
  const [done, setDone] = useState(false);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(p=>({...p,[k]:e.target.value}));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDone(true);
    setTimeout(()=>setDone(false), 3000);
  };

  return (
    <AppLayout bg="bg-[#F4F4F4]">
      <div className="p-6 max-w-xl">
        <p className="text-xs text-gray-400 mb-1">Dashboard&gt;Create tasks</p>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Welcome, Business name</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-7">
          {[
            ["topic","Topic","The title that will go as it is","text"],
            ["dueDate","Due data","The date of completion","date"],
            ["wordCount","Word count","Words that would be compensated","number"],
            ["additional","Additional instructions","Other important instructions to take care of","text"],
            ["payment","Payment for the work","Total payment for writer and subject matter expert","text"],
          ].map(([k,label,hint,type])=>(
            <div key={k as string}>
              <p className="text-base font-semibold text-gray-900 mb-0.5">{label as string}</p>
              <p className="text-xs text-gray-400 mb-2">{hint as string}</p>
              <input
                type={type as string}
                value={form[k as keyof typeof form]}
                onChange={set(k as keyof typeof form)}
                className={inp}
              />
            </div>
          ))}

          {rows.map(r=>(
            <div key={r.id}>
              <div className="flex items-center justify-between mb-1">
                <p className="text-base font-semibold text-gray-900">Extra Instruction</p>
                <button type="button" onClick={()=>setRows(p=>p.filter(x=>x.id!==r.id))} className="text-gray-400 hover:text-red-400 text-xs cursor-pointer">Remove</button>
              </div>
              <input type="text" value={r.value}
                onChange={e=>setRows(p=>p.map(x=>x.id===r.id?{...x,value:e.target.value}:x))}
                className={inp}/>
            </div>
          ))}

          <button type="button" onClick={()=>setRows(p=>[...p,{id:Date.now(),value:""}])}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer w-fit">
            <PlusSquare size={20} strokeWidth={1.5}/> <span className="text-sm font-medium">Add more rows for instructions</span>
          </button>

          <div className="pt-2">
            <button type="submit"
              className="w-44 py-4 rounded-xl bg-[#1A1A2E] text-white text-sm font-semibold hover:bg-[#111] transition-all cursor-pointer">
              {done ? "Submitted ✓" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
