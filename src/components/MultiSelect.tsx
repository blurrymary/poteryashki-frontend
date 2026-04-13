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

  // Close on outside click
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
        className={`border rounded-lg px-3 py-2 text-sm bg-white text-left min-w-[140px] flex items-center justify-between gap-1 ${
          selected.length > 0
            ? "border-orange-400 text-gray-900"
            : "border-gray-300 text-gray-500"
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
        <div className="absolute z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto min-w-[180px]">
          {selected.length > 0 && (
            <button
              type="button"
              onClick={() => onChange([])}
              className="w-full text-left px-3 py-1.5 text-xs text-gray-400 hover:text-gray-600 border-b border-gray-100"
            >
              Сбросить
            </button>
          )}
          {options.map((option) => (
            <label
              key={option}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm"
            >
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={() => toggle(option)}
                className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
              />
              {option}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
