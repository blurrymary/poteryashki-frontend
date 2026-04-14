"use client";
import dynamic from "next/dynamic";
const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

export default function MapSection() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      <h2 className="text-xl font-bold mb-4">На карте</h2>
      <div className="rounded-xl overflow-hidden border border-[var(--border)]">
        <MapView />
      </div>
      <div className="flex gap-6 mt-3 text-xs text-[var(--text-secondary)]">
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500" /> Пропал</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500" /> Найден</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500" /> Ищет дом</span>
      </div>
    </section>
  );
}
