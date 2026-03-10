"use client";

import {
  useRef,
  useState,
  useCallback,
  KeyboardEvent,
  ClipboardEvent,
} from "react";

interface OtpInputProps {
  length?: number;
  onComplete?: (otp: string) => void;
  onChange?: (otp: string) => void;
}

export default function OtpInput({
  length = 6,
  onComplete,
  onChange,
}: OtpInputProps) {
  const [values, setValues] = useState<string[]>(Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const focusAt = useCallback((index: number) => {
    inputRefs.current[index]?.focus();
  }, []);

  const updateValues = useCallback(
    (next: string[]) => {
      setValues(next);
      const joined = next.join("");
      onChange?.(joined);
      if (joined.length === length && next.every((v) => v !== "")) {
        onComplete?.(joined);
      }
    },
    [length, onChange, onComplete]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
      const raw = e.target.value;
      // Accept only last digit typed (handles mobile keyboards sending full value)
      const digit = raw.replace(/\D/g, "").slice(-1);
      if (!digit) return;

      const next = [...values];
      next[index] = digit;
      updateValues(next);

      if (index < length - 1) focusAt(index + 1);
    },
    [values, length, focusAt, updateValues]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>, index: number) => {
      if (e.key === "Backspace") {
        e.preventDefault();
        const next = [...values];
        if (values[index] !== "") {
          // Clear current slot first
          next[index] = "";
          updateValues(next);
        } else if (index > 0) {
          // If already empty, clear previous slot and move focus back
          next[index - 1] = "";
          updateValues(next);
          focusAt(index - 1);
        }
      } else if (e.key === "ArrowLeft" && index > 0) {
        e.preventDefault();
        focusAt(index - 1);
      } else if (e.key === "ArrowRight" && index < length - 1) {
        e.preventDefault();
        focusAt(index + 1);
      }
    },
    [values, length, focusAt, updateValues]
  );

  const handlePaste = useCallback(
    (e: ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pasted = e.clipboardData
        .getData("text")
        .replace(/\D/g, "")
        .slice(0, length);
      if (!pasted) return;

      const next = Array(length).fill("");
      pasted.split("").forEach((char, i) => {
        next[i] = char;
      });
      updateValues(next);
      // Focus the slot after the last pasted character (or last slot)
      focusAt(Math.min(pasted.length, length - 1));
    },
    [length, focusAt, updateValues]
  );

  return (
    <div className="flex items-end gap-3" role="group" aria-label="OTP Input">
      {values.map((val, i) => (
        <input
          key={i}
          ref={(el) => {
            inputRefs.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          pattern="\d*"
          maxLength={2} // allow 2 chars so handleChange can slice last digit
          value={val}
          aria-label={`OTP digit ${i + 1}`}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          className={`
            w-10 h-12 text-center text-xl font-semibold
            bg-transparent outline-none
            border-b-2 transition-colors duration-200
            ${
              val
                ? "border-black text-black"
                : "border-gray-300 text-gray-900"
            }
            focus:border-black
            caret-transparent
          `}
        />
      ))}
    </div>
  );
}
