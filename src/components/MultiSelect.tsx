"use client";

import { useState, useRef, useEffect } from "react";

interface MultiSelectProps {
  label: string;
  options: readonly string[] | string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

export default function MultiSelect({ label, options, selected, onChange }: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function toggle(value: string) {
    onChange(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]);
  }

  const displayText =
    selected.length === 0
      ? label
      : selected.length <= 2
        ? selected.join(", ")
        : `${selected.slice(0, 1).join(", ")} +${selected.length - 1}`;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`surface rounded-lg px-3 py-2 text-sm text-left min-w-[130px] flex items-center justify-between gap-2 transition-all ${
          selected.length > 0
            ? "border-[var(--accent)] text-[var(--text)]"
            : "text-[var(--text-muted)] hover:border-[var(--border-hover)]"
        }`}
      >
        <span className="truncate">{displayText}</span>
        <svg className={`w-3.5 h-3.5 flex-shrink-0 opacity-50 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-[999] mt-1 surface-elevated rounded-lg shadow-2xl shadow-black/50 max-h-60 overflow-y-auto min-w-[180px] animate-fade-in">
          {selected.length > 0 && (
            <button
              type="button"
              onClick={() => onChange([])}
              className="w-full text-left px-3 py-2 text-xs text-[var(--accent)] hover:bg-[var(--accent-dim)] border-b border-[var(--border)] font-medium"
            >
              Сбросить
            </button>
          )}
          {options.map((option) => (
            <label
              key={option}
              className="flex items-center gap-2.5 px-3 py-2 hover:bg-[var(--bg-card)] cursor-pointer text-sm transition-colors"
            >
              <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                selected.includes(option)
                  ? "bg-[var(--accent)] border-[var(--accent)]"
                  : "border-[var(--border-hover)]"
              }`}>
                {selected.includes(option) && (
                  <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className={selected.includes(option) ? "text-[var(--text)]" : "text-[var(--text-secondary)]"}>
                {option}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
