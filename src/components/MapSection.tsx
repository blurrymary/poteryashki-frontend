"use client";

import dynamic from "next/dynamic";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

export default function MapSection() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-xl font-bold mb-4">
        <span className="gradient-text-warm">Карта</span>
      </h2>
      <div className="glass rounded-2xl overflow-hidden p-1">
        <MapView />
      </div>
      <div className="flex gap-5 mt-3 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full badge-lost inline-block shadow-sm" />{" "}
          Пропал
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full badge-found inline-block shadow-sm" />{" "}
          Найден
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full badge-give inline-block shadow-sm" />{" "}
          Отдам
        </span>
      </div>
    </section>
  );
}
