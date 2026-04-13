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

export default async function HomePage() {
  const listings = await getLatestListings();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-orange-300/20 rounded-full blur-3xl" />
        <div className="absolute -top-10 -right-20 w-80 h-80 bg-violet-300/20 rounded-full blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-20 text-center">
          <div className="animate-fade-in">
            <span className="text-5xl md:text-6xl inline-block animate-float">
              🐾
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mt-4 animate-fade-in">
            <span className="gradient-text">Потеряшки BY</span>
          </h1>
          <p className="text-gray-500 text-lg md:text-xl mt-3 max-w-md mx-auto animate-fade-in-delay">
            Помогаем находить пропавших питомцев в&nbsp;Беларуси
          </p>

          <div className="flex flex-wrap justify-center gap-3 mt-8 animate-fade-in-delay-2">
            <Link
              href="/listings?type=lost"
              className="badge-lost btn-shimmer text-white px-6 py-2.5 rounded-full font-semibold shadow-md shadow-red-200 hover:shadow-lg hover:shadow-red-300 hover:scale-105 transition-all flex items-center gap-2"
            >
              <span>🔍</span> Пропавшие
            </Link>
            <Link
              href="/listings?type=found"
              className="badge-found btn-shimmer text-white px-6 py-2.5 rounded-full font-semibold shadow-md shadow-green-200 hover:shadow-lg hover:shadow-green-300 hover:scale-105 transition-all flex items-center gap-2"
            >
              <span>✅</span> Найденные
            </Link>
            <Link
              href="/listings?type=give_away"
              className="badge-give btn-shimmer text-white px-6 py-2.5 rounded-full font-semibold shadow-md shadow-blue-200 hover:shadow-lg hover:shadow-blue-300 hover:scale-105 transition-all flex items-center gap-2"
            >
              <span>💝</span> Отдам в добрые руки
            </Link>
            <Link
              href="/listings?type=help"
              className="bg-gradient-to-r from-amber-500 to-orange-500 btn-shimmer text-white px-6 py-2.5 rounded-full font-semibold shadow-md shadow-amber-200 hover:shadow-lg hover:shadow-amber-300 hover:scale-105 transition-all flex items-center gap-2"
            >
              <span>🩺</span> Нужна помощь
            </Link>
          </div>
        </div>
      </section>

      {/* Map */}
      <MapSection />

      {/* Latest listings */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">
            <span className="gradient-text-warm">Последние объявления</span>
          </h2>
          <Link
            href="/listings"
            className="text-violet-500 hover:text-violet-600 text-sm font-medium transition-colors"
          >
            Смотреть все &rarr;
          </Link>
        </div>

        {listings.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="glass rounded-2xl text-center py-16 text-gray-500">
            <p className="text-5xl mb-4 animate-float">🐾</p>
            <p className="text-lg font-medium">
              Объявлений пока нет. Скоро появятся!
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
