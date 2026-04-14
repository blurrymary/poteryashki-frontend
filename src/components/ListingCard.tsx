import Link from "next/link";
import { Listing, TYPE_LABELS } from "@/lib/types";

export default function ListingCard({ listing }: { listing: Listing }) {
  const timeAgo = getTimeAgo(listing.created_at);
  const hasName = listing.name && listing.name.trim();

  return (
    <Link
      href={`/listings/${listing.id}`}
      className="surface rounded-xl overflow-hidden card-hover block group"
    >
      <div className="relative aspect-[4/3] bg-[var(--bg-elevated)]">
        {listing.photo_url ? (
          <img
            src={listing.photo_url}
            alt={listing.description || "Фото"}
            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[var(--text-muted)] text-3xl">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 21c-1.5 0-3-1-3-2.5S12 16 12 16s3 1 3 2.5S13.5 21 12 21z"/>
              <path d="M8 14c-2 0-4-1-4-3s2-3 4-3 2 3 2 3-2 3-2 3z" transform="rotate(-20 8 11)"/>
              <path d="M16 14c2 0 4-1 4-3s-2-3-4-3-2 3-2 3 2 3 2 3z" transform="rotate(20 16 11)"/>
              <circle cx="7" cy="5" r="2"/><circle cx="17" cy="5" r="2"/>
            </svg>
          </div>
        )}
        <span className={`absolute top-2 left-2 badge-${listing.type === 'give_away' ? 'give' : listing.type} text-xs font-medium px-2.5 py-1 rounded-md`}>
          {TYPE_LABELS[listing.type] || listing.type}
        </span>
      </div>
      <div className="p-3">
        {hasName ? (
          <>
            <h3 className="font-semibold text-sm truncate">{listing.name}</h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5 truncate">
              {listing.animal}{listing.breed ? ` · ${listing.breed}` : ""}{listing.sex ? ` · ${listing.sex}` : ""}
            </p>
          </>
        ) : (
          <h3 className="font-semibold text-sm truncate">
            {listing.animal}{listing.breed ? ` · ${listing.breed}` : ""}
          </h3>
        )}

        {(listing.event_date || listing.district) && (
          <div className="mt-2 space-y-1">
            {listing.event_date && (
              <p className="text-xs text-[var(--accent)] truncate">{listing.event_date}</p>
            )}
            {listing.district && (
              <p className="text-xs text-[var(--text-muted)] truncate">{listing.district}, {listing.city}</p>
            )}
          </div>
        )}
        <p className="text-xs text-[var(--text-muted)] mt-2 opacity-60">{timeAgo}</p>
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
