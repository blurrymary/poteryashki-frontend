import { supabase } from "@/lib/supabase";
import { Listing } from "@/lib/types";
import ListingCard from "@/components/ListingCard";
import MapSection from "@/components/MapSection";
import Link from "next/link";

export const revalidate = 60;

async function getLatestListings(): Promise<Listing[]> {
  const { data } = await supabase
    .from("listings")
    .select("*")
    .eq("moderation_status", "approved")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(12);
  return (data as Listing[]) || [];
}

async function getCounts() {
  const { count: lost } = await supabase.from("listings").select("*", { count: "exact", head: true }).eq("moderation_status", "approved").eq("status", "active").eq("type", "lost");
  const { count: found } = await supabase.from("listings").select("*", { count: "exact", head: true }).eq("moderation_status", "approved").eq("status", "active").eq("type", "found");
  const { count: total } = await supabase.from("listings").select("*", { count: "exact", head: true }).eq("moderation_status", "approved").eq("status", "active");
  return { lost: lost || 0, found: found || 0, total: total || 0 };
}

export default async function HomePage() {
  const [listings, counts] = await Promise.all([getLatestListings(), getCounts()]);

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-4 py-20 md:py-28">
          <p className="text-[var(--accent)] text-sm font-medium tracking-wide uppercase mb-4">
            Агрегатор объявлений
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] max-w-2xl">
            Помогаем находить
            <br />
            <span className="gradient-text">пропавших питомцев</span>
          </h1>
          <p className="text-[var(--text-secondary)] text-lg mt-5 max-w-lg">
            Автоматический мониторинг Telegram-каналов Беларуси. Все объявления о пропавших и найденных животных в одном месте.
          </p>

          {/* Stats */}
          <div className="flex gap-8 mt-10">
            <div>
              <p className="text-3xl font-bold">{counts.total}</p>
              <p className="text-[var(--text-muted)] text-sm mt-0.5">объявлений</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[var(--red)]">{counts.lost}</p>
              <p className="text-[var(--text-muted)] text-sm mt-0.5">ищут хозяина</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[var(--green)]">{counts.found}</p>
              <p className="text-[var(--text-muted)] text-sm mt-0.5">найдены</p>
            </div>
          </div>

          {/* CTA */}
          <div className="flex gap-3 mt-10">
            <Link href="/listings" className="btn-primary px-5 py-2.5 rounded-lg text-sm">
              Смотреть объявления
            </Link>
            <Link href="/new" className="btn-ghost px-5 py-2.5 rounded-lg text-sm">
              Подать объявление
            </Link>
          </div>
        </div>
      </section>

      {/* Map */}
      <MapSection />

      {/* Latest listings */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-lg font-semibold">Последние объявления</h2>
          <Link
            href="/listings"
            className="text-[var(--accent)] hover:text-[var(--accent-hover)] text-sm transition-colors"
          >
            Все объявления &rarr;
          </Link>
        </div>

        {listings.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="surface rounded-xl text-center py-20 text-[var(--text-muted)]">
            <p className="text-lg">Объявлений пока нет</p>
            <p className="text-sm mt-1">Парсер работает — скоро появятся</p>
          </div>
        )}
      </section>
    </div>
  );
}
