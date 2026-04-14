import Link from "next/link";
import { Listing, TYPE_LABELS } from "@/lib/types";

const BADGE: Record<string, string> = {
  lost: "badge-lost", found: "badge-found", give_away: "badge-give", help: "badge-help",
};

export default function ListingCard({ listing }: { listing: Listing }) {
  const timeAgo = getTimeAgo(listing.created_at);
  const hasName = listing.name?.trim();

  return (
    <Link href={`/listings/${listing.id}`} className="card block group">
      <div className="relative aspect-[4/3] bg-[var(--bg-secondary)]">
        {listing.photo_url ? (
          <img
            src={listing.photo_url}
            alt={listing.description || "Фото"}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[var(--text-muted)]">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 21c-1.5 0-3-1-3-2.5S12 16 12 16s3 1 3 2.5S13.5 21 12 21z"/>
              <circle cx="7" cy="5" r="2"/><circle cx="17" cy="5" r="2"/>
            </svg>
          </div>
        )}
      </div>
      <div className="px-1 pt-3 pb-2">
        <div className="flex items-center gap-2 mb-1.5">
          <span className={`${BADGE[listing.type] || "badge-give"} text-xs font-semibold px-2 py-0.5 rounded-md`}>
            {TYPE_LABELS[listing.type] || listing.type}
          </span>
        </div>
        {hasName ? (
          <>
            <h3 className="font-semibold text-[15px] leading-snug">{listing.name}</h3>
            <p className="text-sm text-[var(--text-secondary)] mt-0.5">
              {listing.animal}{listing.breed ? ` · ${listing.breed}` : ""}
            </p>
          </>
        ) : (
          <h3 className="font-semibold text-[15px] leading-snug">
            {listing.animal}{listing.breed ? `, ${listing.breed}` : ""}
          </h3>
        )}
        {listing.district && (
          <p className="text-sm text-[var(--text-secondary)] mt-1">{listing.district}, {listing.city}</p>
        )}
        {listing.event_date && (
          <p className="text-sm text-[var(--text-secondary)] mt-0.5">{listing.event_date}</p>
        )}
        <p className="text-xs text-[var(--text-muted)] mt-2">{timeAgo}</p>
      </div>
    </Link>
  );
}

function getTimeAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 3600) return `${Math.floor(diff / 60)} мин. назад`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} ч. назад`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)} дн. назад`;
  return new Date(dateStr).toLocaleDateString("ru-RU");
}
