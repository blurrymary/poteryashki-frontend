import { supabase } from "@/lib/supabase";
import { Listing, TYPE_LABELS } from "@/lib/types";
import { notFound } from "next/navigation";
import Link from "next/link";

const BADGE_CLASS: Record<string, string> = {
  lost: "badge-lost",
  found: "badge-found",
  give_away: "badge-give",
  help: "badge-help",
};

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
        className="text-violet-500 hover:text-violet-600 text-sm mb-4 inline-block font-medium"
      >
        &larr; Все объявления
      </Link>

      <div className="glass-strong rounded-2xl overflow-hidden shadow-lg shadow-violet-100/20">
        {/* Photo */}
        {listing.photo_url ? (
          <div className="relative aspect-video bg-gray-100">
            <img
              src={listing.photo_url}
              alt={listing.description || "Фото животного"}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          </div>
        ) : (
          <div className="aspect-video bg-gradient-to-br from-violet-50 to-orange-50 flex items-center justify-center text-7xl">
            🐾
          </div>
        )}

        <div className="p-6">
          {/* Badges */}
          <div className="flex items-center gap-2 mb-4">
            <span
              className={`${BADGE_CLASS[listing.type]} text-white text-sm font-semibold px-3 py-1 rounded-full shadow-sm`}
            >
              {TYPE_LABELS[listing.type]}
            </span>
            <span
              className={`text-sm font-medium px-3 py-1 rounded-full ${
                listing.status === "active"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {listing.status === "active" ? "Активно" : "Закрыто"}
            </span>
          </div>

          {/* Info */}
          {listing.name ? (
            <>
              <h1 className="text-3xl font-extrabold gradient-text">{listing.name}</h1>
              <p className="text-gray-500 text-lg mb-4">
                {listing.animal}
                {listing.breed && ` · ${listing.breed}`}
                {listing.sex && ` · ${listing.sex}`}
              </p>
            </>
          ) : (
            <h1 className="text-2xl font-bold mb-4 gradient-text">
              {listing.animal}
              {listing.breed && ` — ${listing.breed}`}
            </h1>
          )}

          <div className="grid grid-cols-2 gap-4 mb-6">
            {listing.color && (
              <div className="glass rounded-xl p-3">
                <span className="text-gray-400 text-xs uppercase tracking-wider">Окрас</span>
                <p className="font-semibold mt-0.5">{listing.color}</p>
              </div>
            )}
            {listing.age && (
              <div className="glass rounded-xl p-3">
                <span className="text-gray-400 text-xs uppercase tracking-wider">Возраст</span>
                <p className="font-semibold mt-0.5">{listing.age}</p>
              </div>
            )}
            {listing.sex && (
              <div className="glass rounded-xl p-3">
                <span className="text-gray-400 text-xs uppercase tracking-wider">Пол</span>
                <p className="font-semibold mt-0.5">{listing.sex}</p>
              </div>
            )}
            {listing.district && (
              <div className="glass rounded-xl p-3">
                <span className="text-gray-400 text-xs uppercase tracking-wider">Район</span>
                <p className="font-semibold mt-0.5">
                  {listing.district}, {listing.city}
                </p>
              </div>
            )}
            {listing.features && (
              <div className="glass rounded-xl p-3 col-span-2">
                <span className="text-gray-400 text-xs uppercase tracking-wider">Особые приметы</span>
                <p className="font-semibold mt-0.5">{listing.features}</p>
              </div>
            )}
          </div>

          {listing.description && (
            <div className="mb-6">
              <span className="text-gray-400 text-xs uppercase tracking-wider">Описание</span>
              <p className="mt-1 text-gray-700 leading-relaxed">{listing.description}</p>
            </div>
          )}

          {/* Contact */}
          {listing.contact && (
            <div className="gradient-primary rounded-xl p-4 mb-4 text-white">
              <span className="text-white/70 text-sm">Контакт</span>
              <p className="font-bold text-lg">{listing.contact}</p>
            </div>
          )}

          {listing.telegram_post_url && (
            <a
              href={listing.telegram_post_url}
              target="_blank"
              rel="noopener noreferrer"
              className="gradient-accent btn-shimmer inline-flex items-center gap-2 text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-md shadow-violet-200 hover:shadow-lg transition-all"
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
