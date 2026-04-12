"use client";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  theme?: "dark" | "light";
}

/**
 * Stick&Dot. wordmark.
 * "Stick" bold · "&" muted · "Dot" bold · "." orange accent
 */
export default function Logo({ size = "md", theme = "dark" }: LogoProps) {
  const textColor = theme === "dark" ? "text-white" : "text-gray-900";
  const mutedColor = theme === "dark" ? "text-white/40" : "text-gray-400";
  const sizeClass = size === "sm" ? "text-sm" : size === "lg" ? "text-xl" : "text-base";

  return (
    <span
      className={`${sizeClass} ${textColor} font-bold tracking-tight select-none inline-flex items-baseline gap-0`}
      aria-label="Stick&Dot."
    >
      <span>Stick</span>
      <span className={`${mutedColor} font-light mx-px`}>&amp;</span>
      <span>Dot</span>
      <span className="text-orange-400">.</span>
    </span>
  );
}
