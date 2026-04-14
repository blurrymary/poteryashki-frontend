import { supabase } from "@/lib/supabase";
import { Listing } from "@/lib/types";
import ListingCard from "@/components/ListingCard";
import MapSection from "@/components/MapSection";
import Link from "next/link";

export const revalidate = 60;

async function getLatestListings(): Promise<Listing[]> {
  const { data } = await supabase
    .from("listings").select("*")
    .eq("moderation_status", "approved").eq("status", "active")
    .order("created_at", { ascending: false }).limit(12);
  return (data as Listing[]) || [];
}

async function getCounts() {
  const q = (type?: string) => {
    let b = supabase.from("listings").select("*", { count: "exact", head: true }).eq("moderation_status", "approved").eq("status", "active");
    if (type) b = b.eq("type", type);
    return b;
  };
  const [{ count: total }, { count: lost }, { count: found }] = await Promise.all([q(), q("lost"), q("found")]);
  return { total: total || 0, lost: lost || 0, found: found || 0 };
}

export default async function HomePage() {
  const [listings, counts] = await Promise.all([getLatestListings(), getCounts()]);

  return (
    <div>
      {/* Hero */}
      <section className="bg-[var(--bg-secondary)]">
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight max-w-xl">
            Найдите своего <br />пропавшего питомца
          </h1>
          <p className="text-[var(--text-secondary)] text-lg mt-4 max-w-md">
            Мониторим Telegram-каналы Беларуси. Все объявления о потерянных и найденных животных — в одном месте.
          </p>

          <div className="flex gap-3 mt-8">
            <Link href="/listings" className="btn-primary px-6 py-3 text-sm">
              Смотреть объявления
            </Link>
            <Link href="/new" className="btn-secondary px-6 py-3 text-sm">
              Я потерял питомца
            </Link>
          </div>

          <div className="flex gap-10 mt-12">
            <div>
              <p className="text-3xl font-bold">{counts.total}</p>
              <p className="text-[var(--text-secondary)] text-sm">объявлений</p>
            </div>
            <div>
              <p className="text-3xl font-bold">{counts.lost}</p>
              <p className="text-[var(--text-secondary)] text-sm">ищут хозяев</p>
            </div>
            <div>
              <p className="text-3xl font-bold">{counts.found}</p>
              <p className="text-[var(--text-secondary)] text-sm">нашлись</p>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <MapSection />

      {/* Latest listings */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold">Последние объявления</h2>
          <Link href="/listings" className="text-[var(--accent)] hover:underline text-sm font-medium">
            Все объявления
          </Link>
        </div>

        {listings.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-[var(--text-secondary)]">
            <p className="text-lg font-medium">Объявлений пока нет</p>
            <p className="text-sm mt-1">Парсер работает — скоро появятся</p>
          </div>
        )}
      </section>
    </div>
  );
}
