import { supabase } from "@/lib/supabase";
import { Listing, TYPE_LABELS } from "@/lib/types";
import { notFound } from "next/navigation";
import Link from "next/link";
import CloseButton from "./CloseButton";

const EVENT_LABEL: Record<string, string> = {
  lost: "Дата пропажи",
  found: "Дата находки",
  give_away: "Дата публикации",
  help: "Дата обращения",
};

export const revalidate = 60;

async function getListing(id: string): Promise<Listing | null> {
  const { data } = await supabase.from("listings").select("*").eq("id", id).eq("moderation_status", "approved").single();
  return data as Listing | null;
}

export default async function ListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const listing = await getListing(id);
  if (!listing) notFound();

  const createdDate = new Date(listing.created_at).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
  const isClosed = listing.status === "closed";
  const badgeClass = `badge-${listing.type === "give_away" ? "give" : listing.type}`;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link href="/listings" className="text-[var(--text-muted)] hover:text-[var(--text)] text-sm mb-6 inline-block transition-colors">
        &larr; Назад
      </Link>

      <div className={`surface rounded-xl overflow-hidden ${isClosed ? "opacity-60" : ""}`}>
        {isClosed && (
          <div className="bg-[var(--bg-elevated)] text-[var(--text-muted)] text-center py-2 text-sm border-b border-[var(--border)]">
            Объявление закрыто
          </div>
        )}

        {listing.photo_url ? (
          <div className={`relative aspect-video bg-[var(--bg-elevated)] ${isClosed ? "grayscale-[50%]" : ""}`}>
            <img src={listing.photo_url} alt={listing.description || "Фото"} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="aspect-video bg-[var(--bg-elevated)] flex items-center justify-center text-[var(--text-muted)]">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M12 21c-1.5 0-3-1-3-2.5S12 16 12 16s3 1 3 2.5S13.5 21 12 21z"/><path d="M8 14c-2 0-4-1-4-3s2-3 4-3 2 3 2 3-2 3-2 3z" transform="rotate(-20 8 11)"/><path d="M16 14c2 0 4-1 4-3s-2-3-4-3-2 3-2 3 2 3 2 3z" transform="rotate(20 16 11)"/><circle cx="7" cy="5" r="2"/><circle cx="17" cy="5" r="2"/></svg>
          </div>
        )}

        <div className="p-6">
          {/* Badges */}
          <div className="flex items-center gap-2 mb-4">
            <span className={`${badgeClass} text-xs font-medium px-2.5 py-1 rounded-md`}>
              {TYPE_LABELS[listing.type] || listing.type}
            </span>
            {isClosed && <span className="text-xs text-[var(--text-muted)] bg-[var(--bg-elevated)] px-2.5 py-1 rounded-md border border-[var(--border)]">Закрыто</span>}
          </div>

          {/* Name */}
          {listing.name ? (
            <>
              <h1 className="text-2xl font-bold">{listing.name}</h1>
              <p className="text-[var(--text-secondary)] mt-1">
                {listing.animal}{listing.breed ? ` · ${listing.breed}` : ""}{listing.sex ? ` · ${listing.sex}` : ""}
              </p>
            </>
          ) : (
            <h1 className="text-2xl font-bold">
              {listing.animal}{listing.breed ? ` — ${listing.breed}` : ""}{listing.sex ? ` (${listing.sex})` : ""}
            </h1>
          )}

          {/* Event date & location */}
          <div className="flex flex-wrap gap-3 mt-5">
            {listing.event_date && (
              <div className="surface-elevated rounded-lg px-4 py-2.5">
                <p className="text-[var(--text-muted)] text-xs uppercase tracking-wider">{EVENT_LABEL[listing.type] || "Дата"}</p>
                <p className="text-sm font-medium mt-0.5 text-[var(--accent)]">{listing.event_date}</p>
              </div>
            )}
            {listing.district && (
              <div className="surface-elevated rounded-lg px-4 py-2.5">
                <p className="text-[var(--text-muted)] text-xs uppercase tracking-wider">Место</p>
                <p className="text-sm font-medium mt-0.5">{listing.district}, {listing.city}</p>
              </div>
            )}
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-3 mt-5">
            {listing.color && (
              <div className="surface-elevated rounded-lg px-4 py-2.5">
                <p className="text-[var(--text-muted)] text-xs uppercase tracking-wider">Окрас</p>
                <p className="text-sm font-medium mt-0.5">{listing.color}</p>
              </div>
            )}
            {listing.age && (
              <div className="surface-elevated rounded-lg px-4 py-2.5">
                <p className="text-[var(--text-muted)] text-xs uppercase tracking-wider">Возраст</p>
                <p className="text-sm font-medium mt-0.5">{listing.age}</p>
              </div>
            )}
            {listing.features && (
              <div className="surface-elevated rounded-lg px-4 py-2.5 col-span-2">
                <p className="text-[var(--text-muted)] text-xs uppercase tracking-wider">Приметы</p>
                <p className="text-sm font-medium mt-0.5">{listing.features}</p>
              </div>
            )}
          </div>

          {listing.description && (
            <div className="mt-5">
              <p className="text-[var(--text-muted)] text-xs uppercase tracking-wider mb-1.5">Описание</p>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{listing.description}</p>
            </div>
          )}

          {/* Contact */}
          {listing.contact && !isClosed && (
            <div className="mt-5 surface-elevated rounded-lg px-4 py-3 border-[var(--accent)]/20" style={{ borderColor: "rgba(167,139,250,0.2)" }}>
              <p className="text-[var(--text-muted)] text-xs uppercase tracking-wider">Контакт</p>
              <p className="text-base font-semibold mt-0.5 text-[var(--accent)]">{listing.contact}</p>
            </div>
          )}

          <div className="flex flex-wrap gap-3 items-center mt-6">
            {listing.telegram_post_url && (
              <a href={listing.telegram_post_url} target="_blank" rel="noopener noreferrer" className="btn-primary px-4 py-2 rounded-lg text-sm">
                Telegram
              </a>
            )}
            {!isClosed && <CloseButton listingId={listing.id} />}
          </div>

          <p className="text-xs text-[var(--text-muted)] mt-6 opacity-60">{createdDate}</p>
        </div>
      </div>
    </div>
  );
}
