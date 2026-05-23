"use client";
import { useState, useRef } from "react";
import AppLayout from "@/components/AppLayout";
import { Plus, X } from "lucide-react";
import { useUser } from "@/components/UserContext";
import { saveArticle } from "@/lib/supabase/articles";

const SUGGESTED_KEYWORDS = ["#technology", "#tech", "#Career", "#innovation", "#future", "#AI", "#coding"];

const WRITER_TOOLS = [
  { label: "Readability", desc: "Check reading ease score of your article" },
  { label: "Grammar",     desc: "Detect and fix grammar issues" },
  { label: "AI",          desc: "Get AI-powered writing suggestions" },
  { label: "Plagiarism",  desc: "Check your content for originality" },
  { label: "WPS",         desc: "Average words per sentence" },
  { label: "SPP",         desc: "Sentences per paragraph analysis" },
  { label: "RW",          desc: "Full readability wizard report" },
];

export default function WriterCreatePage() {
  const { userName } = useUser();
  const [title, setTitle]           = useState("Untitled Article");
  const [tags, setTags]             = useState<string[]>(["#technology"]);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [wordCount, setWordCount]   = useState(0);
  const [loadingAction, setLoadingAction] = useState<"draft" | "submit" | null>(null);
  const [notice, setNotice] = useState("");
  const bodyRef = useRef<HTMLDivElement>(null);

  const addTag = (tag: string) => {
    if (!tags.includes(tag)) setTags(prev => [...prev, tag]);
  };

  const removeTag = (tag: string) => setTags(prev => prev.filter(t => t !== tag));

  const handleBodyInput = () => {
    const text = bodyRef.current?.innerText ?? "";
    setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0);
  };

  const handleSave = async (action: "draft" | "submit") => {
    setNotice("");
    setLoadingAction(action);
    try {
      const body = bodyRef.current?.innerText ?? "";
      const article = await saveArticle({
        title,
        body,
        tags,
        action,
      });
      setNotice(action === "draft" ? "Draft saved." : article.status === "published" ? "Article published." : "Article submitted for SME review.");
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Unable to save article.");
    } finally {
      setLoadingAction(null);
    }
  };

  const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  return (
    <AppLayout bg="bg-white">
      <div className="max-w-4xl mx-auto px-6 md:px-12 py-10 min-h-screen">

        {/* Editable Title */}
        <div
          contentEditable
          suppressContentEditableWarning
          onInput={e => setTitle(e.currentTarget.textContent ?? "")}
          className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-3 leading-tight outline-none empty:before:content-['Article_Title'] empty:before:text-gray-300 focus:empty:before:content-[''] cursor-text"
          data-placeholder="Article Title">
          {title === "Untitled Article" ? "" : title}
        </div>

        {/* Meta row */}
        <div className="text-center text-xs text-gray-400 mb-1 space-x-1">
          <span>{userName || "Your Name"}</span>
          <span>·</span>
          <span>{today}</span>
          <span>·</span>
          <span className="inline-flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-400 inline-block"/>
            {Math.ceil(wordCount / 200) || 0} min read
          </span>
        </div>

        {/* Tags row */}
        <div className="text-center text-xs text-gray-400 mb-6 flex flex-wrap justify-center gap-1">
          {tags.map(tag => (
            <span key={tag} className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 rounded-full px-2.5 py-0.5">
              {tag}
              <button onClick={() => removeTag(tag)} className="hover:text-gray-900 cursor-pointer">
                <X size={10}/>
              </button>
            </span>
          ))}
        </div>

        {/* Black panel — keywords + writing tools, NO engagement */}
        <div className="bg-[#1A1A1A] rounded-2xl p-5 mb-8">
          <div className="flex flex-col md:flex-row gap-6">

            {/* Keywords */}
            <div className="flex-1">
              <p className="text-white text-sm font-semibold mb-1">Suggested Keywords</p>
              <p className="text-gray-500 text-xs mb-3">Click to add to your article tags</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {SUGGESTED_KEYWORDS.map(kw => (
                  <button key={kw} onClick={() => addTag(kw)}
                    className={`text-xs px-3 py-1.5 rounded-full border cursor-pointer transition-all ${
                      tags.includes(kw)
                        ? "bg-white text-black border-white"
                        : "bg-[#2a2a2a] text-gray-300 border-white/10 hover:border-white/40 hover:text-white"
                    }`}>
                    {kw} {!tags.includes(kw) && <Plus size={10} className="inline"/>}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Add custom #tag and press Enter"
                  onKeyDown={e => {
                    if (e.key === "Enter") {
                      const val = e.currentTarget.value.trim();
                      if (val) { addTag(val.startsWith("#") ? val : `#${val}`); e.currentTarget.value = ""; }
                    }
                  }}
                  className="flex-1 bg-[#2a2a2a] border border-white/10 rounded-full px-3 py-1.5 text-xs text-gray-300 placeholder:text-gray-600 outline-none focus:border-white/30"
                />
              </div>

              {/* Writing Tools */}
              <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-2 font-semibold">Writing Tools</p>
              <div className="flex flex-wrap gap-2">
                {WRITER_TOOLS.map(tool => (
                  <button key={tool.label}
                    onClick={() => setActiveTool(activeTool === tool.label ? null : tool.label)}
                    className={`text-xs px-3 py-1.5 rounded-full border cursor-pointer transition-all ${
                      activeTool === tool.label
                        ? "bg-white text-black border-white"
                        : "bg-[#2a2a2a] text-gray-300 border-white/10 hover:border-white/40 hover:text-white"
                    }`}>
                    {tool.label}
                  </button>
                ))}
              </div>
              {activeTool && (
                <p className="text-gray-500 text-xs mt-2">
                  {WRITER_TOOLS.find(t => t.label === activeTool)?.desc}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Body — contentEditable, styled like article body */}
        <div
          ref={bodyRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleBodyInput}
          className="min-h-[400px] text-sm text-gray-700 leading-loose outline-none cursor-text focus:outline-none empty:before:content-['Start_writing_your_article_here...'] empty:before:text-gray-300"
        />

        {/* Sticky bottom bar */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 mt-8 -mx-6 md:-mx-12 px-6 md:px-12 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-400">{wordCount} words</span>
            {notice && <span className="text-xs text-gray-500">{notice}</span>}
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={loadingAction !== null}
              onClick={() => handleSave("draft")}
              className="text-xs text-gray-500 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
            >
              {loadingAction === "draft" ? "Saving…" : "Save Draft"}
            </button>
            <button
              disabled={loadingAction !== null}
              onClick={() => handleSave("submit")}
              className="text-xs bg-[#111] text-white px-4 py-2 rounded-lg hover:bg-[#333] disabled:opacity-50 cursor-pointer font-semibold transition-colors"
            >
              {loadingAction === "submit" ? "Submitting…" : "Publish"}
            </button>
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
