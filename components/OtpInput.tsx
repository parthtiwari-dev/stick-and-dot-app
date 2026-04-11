"use client";
import { useRef, useState, KeyboardEvent, ClipboardEvent } from "react";

interface Props { length?: number; onChange: (val: string) => void; }

export default function OtpInput({ length = 6, onChange }: Props) {
  const [vals, setVals] = useState<string[]>(Array(length).fill(""));
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const update = (next: string[]) => { setVals(next); onChange(next.join("")); };

  const handleChange = (i: number, v: string) => {
    const d = v.replace(/\D/g, "").slice(-1);
    const next = [...vals]; next[i] = d; update(next);
    if (d && i < length - 1) refs.current[i + 1]?.focus();
  };

  const handleKey = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !vals[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    const next = [...vals];
    text.split("").forEach((c, i) => { next[i] = c; });
    update(next);
    refs.current[Math.min(text.length, length - 1)]?.focus();
  };

  return (
    <div className="flex gap-3">
      {vals.map((v, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          type="text" inputMode="numeric" maxLength={1} value={v}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKey(i, e)}
          onPaste={handlePaste}
          className="w-11 h-11 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:border-black focus:outline-none bg-white text-gray-900 transition-colors"
        />
      ))}
    </div>
  );
}
