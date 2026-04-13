import { supabase } from "@/lib/supabase";
import { Listing, TYPE_LABELS, TYPE_COLORS } from "@/lib/types";
import { notFound } from "next/navigation";
import Link from "next/link";

export const revalidate = 60;

async function getListing(id: string): Promise<Listing | null> {
  const { data } = await supabase
    .from("listings")
    .select("*")
    .eq("id", id)
    .eq("moderation_status", "approved")
    .single();
  return data as Listing | null;
}

export default async function ListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await getListing(id);

  if (!listing) notFound();

  const date = new Date(listing.created_at).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link
        href="/listings"
        className="text-orange-500 hover:text-orange-600 text-sm mb-4 inline-block"
      >
        &larr; Все объявления
      </Link>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Photo */}
        {listing.photo_url ? (
          <div className="relative aspect-video bg-gray-100">
            <img
              src={listing.photo_url}
              alt={listing.description || "Фото животного"}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="aspect-video bg-gray-100 flex items-center justify-center text-gray-400 text-6xl">
            🐾
          </div>
        )}

        <div className="p-6">
          {/* Badges */}
          <div className="flex items-center gap-2 mb-4">
            <span
              className={`${TYPE_COLORS[listing.type]} text-white text-sm font-semibold px-3 py-1 rounded-full`}
            >
              {TYPE_LABELS[listing.type]}
            </span>
            <span
              className={`text-sm font-medium px-3 py-1 rounded-full ${listing.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
            >
              {listing.status === "active" ? "Активно" : "Закрыто"}
            </span>
          </div>

          {/* Info */}
          <h1 className="text-2xl font-bold mb-4">
            {listing.animal}
            {listing.breed && ` — ${listing.breed}`}
            {listing.name && ` (${listing.name})`}
          </h1>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {listing.color && (
              <div>
                <span className="text-gray-500 text-sm">Окрас</span>
                <p className="font-medium">{listing.color}</p>
              </div>
            )}
            {listing.age && (
              <div>
                <span className="text-gray-500 text-sm">Возраст</span>
                <p className="font-medium">{listing.age}</p>
              </div>
            )}
            {listing.district && (
              <div>
                <span className="text-gray-500 text-sm">Район</span>
                <p className="font-medium">
                  {listing.district}, {listing.city}
                </p>
              </div>
            )}
            {listing.features && (
              <div className="col-span-2">
                <span className="text-gray-500 text-sm">Особые приметы</span>
                <p className="font-medium">{listing.features}</p>
              </div>
            )}
          </div>

          {listing.description && (
            <div className="mb-6">
              <span className="text-gray-500 text-sm">Описание</span>
              <p className="mt-1">{listing.description}</p>
            </div>
          )}

          {/* Contact */}
          {listing.contact && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
              <span className="text-gray-500 text-sm">Контакт</span>
              <p className="font-semibold text-lg">{listing.contact}</p>
            </div>
          )}

          {listing.telegram_post_url && (
            <a
              href={listing.telegram_post_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Открыть в Telegram
            </a>
          )}

          <p className="text-sm text-gray-400 mt-6">Опубликовано {date}</p>
        </div>
      </div>
    </div>
  );
}
