import Link from "next/link";
import { Listing, TYPE_LABELS } from "@/lib/types";

const BADGE_CLASS: Record<string, string> = {
  lost: "badge-lost",
  found: "badge-found",
  give_away: "badge-give",
};

export default function ListingCard({ listing }: { listing: Listing }) {
  const timeAgo = getTimeAgo(listing.created_at);

  return (
    <Link
      href={`/listings/${listing.id}`}
      className="glass rounded-2xl overflow-hidden card-hover block"
    >
      <div className="relative aspect-[4/3] bg-gray-100">
        {listing.photo_url ? (
          <>
            <img
              src={listing.photo_url}
              alt={listing.description || "Фото животного"}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-50 to-orange-50 text-5xl">
            🐾
          </div>
        )}
        <span
          className={`absolute top-2.5 left-2.5 ${BADGE_CLASS[listing.type]} text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm`}
        >
          {TYPE_LABELS[listing.type]}
        </span>
      </div>
      <div className="p-3.5">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-bold text-sm text-gray-800">
            {listing.animal}
            {listing.breed && `, ${listing.breed}`}
          </span>
        </div>
        {listing.name && (
          <p className="text-sm text-violet-600 font-medium">
            {listing.name}
          </p>
        )}
        {listing.district && (
          <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1">
            <span className="text-orange-400">📍</span> {listing.district},{" "}
            {listing.city}
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
