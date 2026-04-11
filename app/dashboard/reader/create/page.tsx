"use client";
import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import Link from "next/link";
import { PlusCircle, Trash2 } from "lucide-react";

const GENRES = ["Technology","Finance","Health","Science","Culture","Politics","Business","Sports","Other"];

interface ArticleSlot { id: number; title: string; note: string; }

export default function ReaderCreateList() {
  const [listName, setListName]     = useState("");
  const [description, setDesc]      = useState("");
  const [genre, setGenre]           = useState("");
  const [isPrivate, setIsPrivate]   = useState(false);
  const [articles, setArticles]     = useState<ArticleSlot[]>([{ id: 1, title: "", note: "" }]);

  const addArticle    = () => setArticles(p => [...p, { id: Date.now(), title: "", note: "" }]);
  const removeArticle = (id: number) => setArticles(p => p.filter(a => a.id !== id));
  const updArticle    = (id: number, field: "title" | "note", v: string) =>
    setArticles(p => p.map(a => a.id === id ? { ...a, [field]: v } : a));

  const inp = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-gray-400 bg-white placeholder:text-gray-300 transition-colors";

  return (
    <AppLayout bg="bg-[#F4F4F4]">
      <div className="p-4 md:p-6 max-w-2xl">
        <p className="text-xs text-gray-400 mb-1">
          <Link href="/dashboard/reader" className="hover:text-gray-700">Dashboard</Link>
          &gt;Create Reading List
        </p>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Create a Reading List</h1>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 flex flex-col gap-5">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">List Name</label>
            <p className="text-xs text-gray-400 mb-2">Give your reading list a title</p>
            <input type="text" value={listName} onChange={e => setListName(e.target.value)}
              placeholder="e.g. My AI Reads, Weekend Deep Dives…" className={inp} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Description</label>
            <p className="text-xs text-gray-400 mb-2">What is this list about?</p>
            <textarea value={description} onChange={e => setDesc(e.target.value)}
              rows={3} placeholder="A curated set of articles on the impact of AI on daily life…"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-gray-400 bg-white placeholder:text-gray-300 transition-colors resize-none" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Genre / Theme</label>
            <p className="text-xs text-gray-400 mb-2">Primary genre this list covers</p>
            <select value={genre} onChange={e => setGenre(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-gray-400 bg-white cursor-pointer">
              <option value="">Select a genre…</option>
              {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Visibility</label>
            <div className="flex gap-3">
              {[{ label: "Public", priv: false }, { label: "Private", priv: true }].map(opt => (
                <button key={String(opt.priv)} type="button"
                  onClick={() => setIsPrivate(opt.priv)}
                  className={`flex-1 py-3 rounded-xl text-sm font-semibold border transition-all cursor-pointer ${
                    isPrivate === opt.priv
                      ? "bg-[#111] text-white border-[#111]"
                      : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                  }`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Articles to Add</label>
            <p className="text-xs text-gray-400 mb-3">Add article titles and a personal note for each</p>
            <div className="flex flex-col gap-3">
              {articles.map((a, idx) => (
                <div key={a.id} className="bg-gray-50 rounded-xl p-4 flex flex-col gap-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-gray-500">Article {idx + 1}</span>
                    {articles.length > 1 && (
                      <button onClick={() => removeArticle(a.id)}
                        className="text-gray-300 hover:text-red-400 cursor-pointer transition-colors">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                  <input type="text" value={a.title}
                    onChange={e => updArticle(a.id, "title", e.target.value)}
                    placeholder="Article title or topic…" className={inp} />
                  <input type="text" value={a.note}
                    onChange={e => updArticle(a.id, "note", e.target.value)}
                    placeholder="Why you want to read this…" className={inp} />
                </div>
              ))}
            </div>
          </div>

          <button onClick={addArticle}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 cursor-pointer transition-colors w-fit">
            <PlusCircle size={16} />Add another article
          </button>

          <button className="w-full py-4 bg-[#111] text-white rounded-xl text-sm font-semibold hover:bg-[#333] transition-colors cursor-pointer mt-2">
            Create List
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
