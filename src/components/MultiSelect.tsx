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

  const displayText = selected.length === 0 ? label
    : selected.length <= 2 ? selected.join(", ")
    : `${selected[0]} +${selected.length - 1}`;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`rounded-full px-4 py-2 text-sm flex items-center gap-2 transition-all border ${
          selected.length > 0
            ? "border-[var(--text)] text-[var(--text)] bg-[var(--bg-secondary)]"
            : "border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-hover)]"
        }`}
      >
        <span className="truncate max-w-[120px]">{displayText}</span>
        <svg className={`w-3 h-3 flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-[999] mt-2 bg-white rounded-xl shadow-lg shadow-black/8 border border-[var(--border)] max-h-60 overflow-y-auto min-w-[200px] animate-fade-in">
          {selected.length > 0 && (
            <button type="button" onClick={() => onChange([])}
              className="w-full text-left px-4 py-2.5 text-xs text-[var(--accent)] hover:bg-[var(--bg-secondary)] border-b border-[var(--border)] font-medium">
              Сбросить
            </button>
          )}
          {options.map((option) => (
            <label key={option} className="flex items-center gap-3 px-4 py-2.5 hover:bg-[var(--bg-secondary)] cursor-pointer text-sm transition-colors">
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={() => onChange(selected.includes(option) ? selected.filter(v => v !== option) : [...selected, option])}
                className="rounded border-[var(--border-hover)] text-[var(--accent)] focus:ring-[var(--accent)]"
              />
              {option}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
