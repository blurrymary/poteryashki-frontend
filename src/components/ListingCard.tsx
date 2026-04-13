import Link from "next/link";
import { Listing, TYPE_LABELS, TYPE_COLORS } from "@/lib/types";

export default function ListingCard({ listing }: { listing: Listing }) {
  const timeAgo = getTimeAgo(listing.created_at);

  return (
    <Link
      href={`/listings/${listing.id}`}
      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow block"
    >
      <div className="relative aspect-[4/3] bg-gray-100">
        {listing.photo_url ? (
          <img
            src={listing.photo_url}
            alt={listing.description || "Фото животного"}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">
            🐾
          </div>
        )}
        <span
          className={`absolute top-2 left-2 ${TYPE_COLORS[listing.type]} text-white text-xs font-semibold px-2 py-1 rounded-full`}
        >
          {TYPE_LABELS[listing.type]}
        </span>
      </div>
      <div className="p-3">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-sm">
            {listing.animal}
            {listing.breed && `, ${listing.breed}`}
          </span>
        </div>
        {listing.name && (
          <p className="text-sm text-gray-600">Кличка: {listing.name}</p>
        )}
        {listing.district && (
          <p className="text-xs text-gray-500 mt-1">
            📍 {listing.district}, {listing.city}
          </p>
        )}
        <p className="text-xs text-gray-400 mt-2">{timeAgo}</p>
      </div>
    </Link>
  );
}

function getTimeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 3600) return `${Math.floor(diff / 60)} мин. назад`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} ч. назад`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)} дн. назад`;
  return date.toLocaleDateString("ru-RU");
}
