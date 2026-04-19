"use client";
import { useRef, useState, useEffect, useCallback } from "react";
import AppLayout from "@/components/AppLayout";
import { useUser } from "@/components/UserContext";
import { Bold, Italic, Heading2, Heading3, List } from "lucide-react";

const SUGGESTED_KEYWORDS = [
  "#technology","#finance","#health","#climate","#startups",
  "#AI","#design","#culture","#science","#future",
  "#innovation","#policy","#economy","#education","#data",
];

const OPEN_COMMISSIONS = [
  "Independent",
  "The Future of EVs in India — GreenMiles Co.",
  "Top 10 Finance Hacks for Gen-Z — MoneyMind Media",
  "AI in Healthcare — MedScope Inc.",
  "Sustainable Fashion on a Budget — TrendLoop",
];

function countWords(html: string) {
  return html.replace(/<[^>]*>/g, " ").trim().split(/\s+/).filter(Boolean).length;
}
function readTime(words: number) {
  return Math.max(1, Math.round(words / 200));
}

export default function WriterCreate() {
  const { userName } = useUser();
  const titleRef   = useRef<HTMLDivElement>(null);
  const bodyRef    = useRef<HTMLDivElement>(null);

  const [tags, setTags]             = useState<string[]>([]);
  const [tagInput, setTagInput]     = useState("");
  const [commission, setCommission] = useState("Independent");
  const [wordCount, setWordCount]   = useState(0);
  const [titleFilled, setTitleFilled] = useState(false);
  const [toolbar, setToolbar] = useState<{ top: number; left: number; show: boolean }>({ top:0, left:0, show:false });

  const today = new Date().toLocaleDateString("en-GB", { day:"numeric", month:"long", year:"numeric" });

  const onBodyInput = useCallback(() => {
    if (bodyRef.current) setWordCount(countWords(bodyRef.current.innerHTML));
  }, []);

  const onTitleInput = useCallback(() => {
    setTitleFilled(!!titleRef.current?.innerText.trim());
  }, []);

  const handleSelectionChange = useCallback(() => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !sel.rangeCount) {
      setToolbar(t => ({ ...t, show: false }));
      return;
    }
    const range = sel.getRangeAt(0);
    if (!bodyRef.current?.contains(range.commonAncestorContainer)) {
      setToolbar(t => ({ ...t, show: false }));
      return;
    }
    const rect     = range.getBoundingClientRect();
    const bodyEl   = bodyRef.current;
    const canvas   = bodyEl?.closest(".create-canvas");
    const canvasRect = canvas?.getBoundingClientRect() ?? { top:0, left:0 };
    setToolbar({
      show: true,
      top:  rect.top  - canvasRect.top  - 52,
      left: rect.left - canvasRect.left + rect.width / 2,
    });
  }, []);

  useEffect(() => {
    document.addEventListener("selectionchange", handleSelectionChange);
    return () => document.removeEventListener("selectionchange", handleSelectionChange);
  }, [handleSelectionChange]);

  const exec = (cmd: string, value?: string) => {
    document.execCommand(cmd, false, value);
    bodyRef.current?.focus();
    onBodyInput();
  };

  const addKeyword = (kw: string) => {
    if (!tags.includes(kw)) setTags(p => [...p, kw]);
  };

  const addTagFromInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const t = tagInput.trim().replace(/,/g, "");
      if (t && !tags.includes(t)) setTags(p => [...p, t.startsWith("#") ? t : "#"+t]);
      setTagInput("");
    }
  };

  const removeTag = (t: string) => setTags(p => p.filter(x => x !== t));
  const canPublish = titleFilled && wordCount >= 100;

  return (
    <AppLayout bg="bg-white">
      {/* create-canvas: relative container for the floating toolbar */}
      <div className="create-canvas relative flex flex-col min-h-screen">

        {/* Scrollable writing area */}
        <div className="flex flex-1">
          {/* Main canvas */}
          <div className="flex-1 px-8 md:px-16 lg:px-24 pt-12 pb-8 max-w-3xl">

            {/* Floating selection toolbar */}
            {toolbar.show && (
              <div
                style={{ position:"absolute", top: toolbar.top, left: toolbar.left, transform:"translateX(-50%)", zIndex:50 }}
                className="flex items-center gap-1 bg-[#111] rounded-xl px-2 py-1.5 shadow-2xl pointer-events-auto"
                onMouseDown={e => e.preventDefault()}
              >
                {[
                  { icon:<Bold size={14}/>,     cmd:"bold",               title:"Bold"        },
                  { icon:<Italic size={14}/>,   cmd:"italic",             title:"Italic"      },
                  { icon:<Heading2 size={14}/>, cmd:"formatBlock",        title:"Heading 2",  val:"h2" },
                  { icon:<Heading3 size={14}/>, cmd:"formatBlock",        title:"Heading 3",  val:"h3" },
                  { icon:<List size={14}/>,     cmd:"insertUnorderedList",title:"Bullet list" },
                ].map(({ icon, cmd, title, val }) => (
                  <button key={title} title={title}
                    onMouseDown={e => { e.preventDefault(); exec(cmd, val); }}
                    className="text-white hover:text-orange-400 p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
                    {icon}
                  </button>
                ))}
              </div>
            )}

            {/* Title */}
            <div
              ref={titleRef}
              contentEditable
              suppressContentEditableWarning
              onInput={onTitleInput}
              data-placeholder="Your Article Title…"
              className="text-3xl md:text-4xl font-black text-gray-900 leading-tight outline-none mb-4
                         empty:before:content-[attr(data-placeholder)] empty:before:text-gray-300"
            />

            {/* Meta */}
            <div className="flex items-center gap-3 text-sm text-gray-400 mb-8 pb-4 border-b border-gray-100">
              <span className="font-medium text-gray-700">{userName || "Your Name"}</span>
              <span>·</span>
              <span>{today}</span>
              <span>·</span>
              <span>{readTime(wordCount)} min read</span>
            </div>

            {/* Body */}
            <div
              ref={bodyRef}
              contentEditable
              suppressContentEditableWarning
              onInput={onBodyInput}
              data-placeholder="Click here and start writing your article…"
              className="min-h-[420px] text-gray-800 text-base md:text-lg leading-relaxed outline-none
                         empty:before:content-[attr(data-placeholder)] empty:before:text-gray-300
                         [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-gray-900
                         [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-gray-800
                         [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-3
                         [&_b]:font-bold [&_i]:italic"
            />
          </div>

          {/* Right keywords panel */}
          <aside className="hidden lg:flex flex-col w-60 flex-shrink-0 border-l border-gray-100 pt-12 px-5 self-start sticky top-0 max-h-screen overflow-y-auto">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Suggested Keywords</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_KEYWORDS.map(kw => (
                <button key={kw} onClick={() => addKeyword(kw)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                    tags.includes(kw)
                      ? "bg-[#111] text-white border-[#111]"
                      : "bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-400 hover:text-gray-900"
                  }`}>
                  {kw}
                </button>
              ))}
            </div>
          </aside>
        </div>

        {/* Sticky bottom bar — no hardcoded left offset, lives inside main scroll area */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-8 py-3 flex flex-wrap items-center gap-4 z-30">
          {/* Word count */}
          <span className="text-xs text-gray-400 flex-shrink-0 tabular-nums">{wordCount} words</span>
          <div className="h-4 w-px bg-gray-200 flex-shrink-0"/>

          {/* Tags */}
          <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
            {tags.map(t => (
              <span key={t} className="flex items-center gap-1 text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">
                {t}
                <button onClick={() => removeTag(t)} className="text-gray-400 hover:text-gray-700 cursor-pointer leading-none ml-0.5">×</button>
              </span>
            ))}
            <input
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={addTagFromInput}
              placeholder="Add tag…"
              className="text-xs text-gray-600 outline-none bg-transparent placeholder:text-gray-300 w-20"
            />
          </div>
          <div className="h-4 w-px bg-gray-200 flex-shrink-0"/>

          {/* Commission */}
          <select
            value={commission}
            onChange={e => setCommission(e.target.value)}
            className="text-xs text-gray-600 bg-white border border-gray-200 rounded-lg px-3 py-1.5 outline-none cursor-pointer flex-shrink-0 max-w-[220px]">
            {OPEN_COMMISSIONS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          {/* Publish */}
          <button
            disabled={!canPublish}
            title={canPublish ? "Publish article" : "Add a title and at least 100 words to publish"}
            className={`flex-shrink-0 px-6 py-2 rounded-xl text-sm font-semibold transition-all ${
              canPublish
                ? "bg-[#111] text-white hover:bg-[#333] cursor-pointer"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}>
            Publish
          </button>
        </div>

      </div>
    </AppLayout>
  );
}
