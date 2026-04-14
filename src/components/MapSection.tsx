"use client";

import dynamic from "next/dynamic";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

export default function MapSection() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-lg font-semibold mb-4">Карта</h2>
      <div className="surface rounded-xl overflow-hidden">
        <MapView />
      </div>
      <div className="flex gap-5 mt-3 text-xs text-[var(--text-muted)]">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--red)] inline-block" /> Пропал
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--green)] inline-block" /> Найден
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--blue)] inline-block" /> Ищет дом
        </span>
      </div>
    </section>
  );
}
