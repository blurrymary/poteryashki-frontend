"use client";

import { useState, useRef, useEffect } from "react";

interface MultiSelectProps {
  label: string;
  options: readonly string[] | string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

export default function MultiSelect({
  label,
  options,
  selected,
  onChange,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function toggle(value: string) {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  }

  const displayText =
    selected.length === 0
      ? label
      : selected.length <= 2
        ? selected.join(", ")
        : `${selected.slice(0, 2).join(", ")} +${selected.length - 2}`;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`glass rounded-full px-4 py-2 text-sm text-left min-w-[140px] flex items-center justify-between gap-2 transition-all ${
          selected.length > 0
            ? "ring-2 ring-violet-400 text-gray-900 shadow-sm shadow-violet-100"
            : "text-gray-500 hover:ring-1 hover:ring-gray-300"
        }`}
      >
        <span className="truncate">{displayText}</span>
        <svg
          className={`w-3 h-3 flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 mt-2 glass-strong rounded-xl shadow-xl shadow-violet-100/30 max-h-60 overflow-y-auto min-w-[200px] animate-fade-in">
          {selected.length > 0 && (
            <button
              type="button"
              onClick={() => onChange([])}
              className="w-full text-left px-3 py-2 text-xs text-violet-500 hover:text-violet-700 border-b border-gray-100/50 font-medium"
            >
              ✕ Сбросить
            </button>
          )}
          {options.map((option) => (
            <label
              key={option}
              className="flex items-center gap-2.5 px-3 py-2.5 hover:bg-violet-50/50 cursor-pointer text-sm transition-colors"
            >
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={() => toggle(option)}
                className="rounded border-gray-300 text-violet-500 focus:ring-violet-500"
              />
              {option}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
