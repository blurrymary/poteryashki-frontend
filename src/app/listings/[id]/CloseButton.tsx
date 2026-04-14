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
      alert("Ошибка при закрытии");
    } finally {
      setLoading(false);
      setConfirming(false);
    }
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-[var(--text-muted)]">Закрыть?</span>
        <button onClick={handleClose} disabled={loading} className="btn-ghost px-3 py-1.5 rounded-lg text-xs">
          {loading ? "..." : "Да"}
        </button>
        <button onClick={() => setConfirming(false)} className="text-xs text-[var(--text-muted)] hover:text-[var(--text)]">
          Отмена
        </button>
      </div>
    );
  }

  return (
    <button onClick={() => setConfirming(true)} className="btn-ghost px-4 py-2 rounded-lg text-sm">
      Неактуально
    </button>
  );
}
