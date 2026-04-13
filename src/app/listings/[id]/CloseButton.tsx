"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CloseButton({ listingId }: { listingId: string }) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleClose() {
    setLoading(true);
    try {
      await fetch(`/api/listings/${listingId}/close`, { method: "POST" });
      router.refresh();
    } catch {
      alert("Ошибка при закрытии объявления");
    } finally {
      setLoading(false);
      setConfirming(false);
    }
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">Точно закрыть?</span>
        <button
          onClick={handleClose}
          disabled={loading}
          className="bg-gray-700 hover:bg-gray-800 disabled:opacity-50 text-white px-4 py-2 rounded-full text-sm font-semibold transition-all"
        >
          {loading ? "..." : "Да, закрыть"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="glass text-gray-500 hover:text-gray-700 px-4 py-2 rounded-full text-sm font-medium transition-all"
        >
          Отмена
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="glass text-gray-500 hover:text-gray-700 px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5"
    >
      <span>✓</span> Объявление неактуально
    </button>
  );
}
