"use client";
import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

const CATEGORIES = ["Technology","Finance","Health & Wellness","Science","Business","Culture","Politics","Sports","Other"];

export default function WriterCreateArticle() {
  const [title, setTitle]         = useState("");
  const [category, setCategory]   = useState("");
  const [wordTarget, setWordTarget] = useState("");
  const [outline, setOutline]     = useState("");
  const [tags, setTags]           = useState("");
  const [notes, setNotes]         = useState<{ id: number; value: string }[]>([{ id: 1, value: "" }]);

  const addNote  = () => setNotes(p => [...p, { id: Date.now(), value: "" }]);
  const updNote  = (id: number, v: string) => setNotes(p => p.map(n => n.id === id ? { ...n, value: v } : n));

  const inp = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-gray-400 bg-white placeholder:text-gray-300 transition-colors";

  return (
    <AppLayout bg="bg-[#F4F4F4]">
      <div className="p-4 md:p-6 max-w-2xl">
        <p className="text-xs text-gray-400 mb-1">
          <Link href="/dashboard/writer" className="hover:text-gray-700">Dashboard</Link>
          &gt;New Article
        </p>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Start a New Article</h1>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 flex flex-col gap-5">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Article Title</label>
            <p className="text-xs text-gray-400 mb-2">Give your article a working title</p>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)}
              placeholder="e.g. The Future of Renewable Energy" className={inp} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Category</label>
            <p className="text-xs text-gray-400 mb-2">Pick the category that fits best</p>
            <select value={category} onChange={e => setCategory(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-gray-400 bg-white cursor-pointer">
              <option value="">Select a category…</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Target Word Count</label>
            <p className="text-xs text-gray-400 mb-2">How long do you plan to write?</p>
            <input type="number" value={wordTarget} onChange={e => setWordTarget(e.target.value)}
              placeholder="e.g. 1200" className={inp} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Tags / Keywords</label>
            <p className="text-xs text-gray-400 mb-2">Comma-separated tags to help with discovery</p>
            <input type="text" value={tags} onChange={e => setTags(e.target.value)}
              placeholder="e.g. #technology, #climate, #future" className={inp} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Outline / Key Points</label>
            <p className="text-xs text-gray-400 mb-2">Rough structure or main points to cover</p>
            <textarea value={outline} onChange={e => setOutline(e.target.value)}
              rows={4} placeholder={"1. Introduction\n2. Main argument\n3. Evidence\n4. Conclusion"}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-gray-400 bg-white placeholder:text-gray-300 transition-colors resize-none" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Research Notes</label>
            <p className="text-xs text-gray-400 mb-2">Sources, links, or reference material</p>
            {notes.map(n => (
              <input key={n.id} type="text" value={n.value}
                onChange={e => updNote(n.id, e.target.value)}
                placeholder="Add a research note or link…" className={`${inp} mb-2`} />
            ))}
          </div>

          <button onClick={addNote}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 cursor-pointer transition-colors w-fit">
            <PlusCircle size={16} />Add more research notes
          </button>

          <div className="flex gap-3 mt-2">
            <button className="flex-1 py-4 bg-[#111] text-white rounded-xl text-sm font-semibold hover:bg-[#333] transition-colors cursor-pointer">
              Save Draft
            </button>
            <button className="flex-1 py-4 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors cursor-pointer">
              Submit for Review
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
