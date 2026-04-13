import { supabase } from "@/lib/supabase";
import { Listing } from "@/lib/types";
import ListingCard from "@/components/ListingCard";
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
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Потеряшки BY
          </h1>
          <p className="text-gray-600 text-lg mb-6">
            Помогаем находить пропавших питомцев в Беларуси
          </p>
          <div className="flex justify-center gap-3">
            <Link
              href="/listings?type=lost"
              className="bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
            >
              Пропавшие
            </Link>
            <Link
              href="/listings?type=found"
              className="bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
            >
              Найденные
            </Link>
            <Link
              href="/listings?type=give_away"
              className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
            >
              Отдам в добрые руки
            </Link>
          </div>
        </div>
      </section>

      {/* Latest listings */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Последние объявления</h2>
          <Link
            href="/listings"
            className="text-orange-500 hover:text-orange-600 text-sm font-medium"
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
          <div className="text-center py-12 text-gray-500">
            <p className="text-4xl mb-3">🐾</p>
            <p>Объявлений пока нет. Скоро появятся!</p>
          </div>
        )}
      </section>
    </div>
  );
}
