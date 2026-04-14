import { supabase } from "@/lib/supabase";
import { Listing, TYPE_LABELS } from "@/lib/types";
import { notFound } from "next/navigation";
import Link from "next/link";
import CloseButton from "./CloseButton";

const BADGE: Record<string, string> = { lost: "badge-lost", found: "badge-found", give_away: "badge-give", help: "badge-help" };
const EVENT_LABEL: Record<string, string> = { lost: "Дата пропажи", found: "Дата находки", give_away: "Дата", help: "Дата обращения" };

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

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <Link href="/listings" className="text-[var(--text-secondary)] hover:text-[var(--text)] text-sm mb-6 inline-flex items-center gap-1 transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Назад
      </Link>

      <div className={`rounded-2xl overflow-hidden border border-[var(--border)] ${isClosed ? "opacity-60" : ""}`}>
        {isClosed && (
          <div className="bg-[var(--bg-secondary)] text-[var(--text-secondary)] text-center py-2.5 text-sm font-medium border-b border-[var(--border)]">
            Объявление закрыто
          </div>
        )}

        {listing.photo_url ? (
          <div className={`aspect-video bg-[var(--bg-secondary)] ${isClosed ? "grayscale-[40%]" : ""}`}>
            <img src={listing.photo_url} alt="" className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="aspect-video bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-muted)]">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 21c-1.5 0-3-1-3-2.5S12 16 12 16s3 1 3 2.5S13.5 21 12 21z"/><circle cx="7" cy="5" r="2"/><circle cx="17" cy="5" r="2"/></svg>
          </div>
        )}

        <div className="p-6 md:p-8">
          <div className="flex items-center gap-2 mb-4">
            <span className={`${BADGE[listing.type] || "badge-give"} text-xs font-semibold px-2.5 py-1 rounded-md`}>
              {TYPE_LABELS[listing.type] || listing.type}
            </span>
          </div>

          {listing.name ? (
            <>
              <h1 className="text-2xl md:text-3xl font-bold">{listing.name}</h1>
              <p className="text-[var(--text-secondary)] text-lg mt-1">
                {listing.animal}{listing.breed ? ` · ${listing.breed}` : ""}{listing.sex ? ` · ${listing.sex}` : ""}
              </p>
            </>
          ) : (
            <h1 className="text-2xl md:text-3xl font-bold">
              {listing.animal}{listing.breed ? `, ${listing.breed}` : ""}
            </h1>
          )}

          {/* Key info */}
          <div className="flex flex-wrap gap-3 mt-6">
            {listing.event_date && (
              <div className="bg-[var(--bg-secondary)] rounded-xl px-4 py-3">
                <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-medium">{EVENT_LABEL[listing.type] || "Дата"}</p>
                <p className="font-semibold text-sm mt-0.5">{listing.event_date}</p>
              </div>
            )}
            {listing.district && (
              <div className="bg-[var(--bg-secondary)] rounded-xl px-4 py-3">
                <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-medium">Место</p>
                <p className="font-semibold text-sm mt-0.5">{listing.district}, {listing.city}</p>
              </div>
            )}
            {listing.color && (
              <div className="bg-[var(--bg-secondary)] rounded-xl px-4 py-3">
                <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-medium">Окрас</p>
                <p className="font-semibold text-sm mt-0.5">{listing.color}</p>
              </div>
            )}
            {listing.age && (
              <div className="bg-[var(--bg-secondary)] rounded-xl px-4 py-3">
                <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-medium">Возраст</p>
                <p className="font-semibold text-sm mt-0.5">{listing.age}</p>
              </div>
            )}
          </div>

          {listing.features && (
            <div className="mt-6">
              <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-medium mb-1">Особые приметы</p>
              <p className="text-[var(--text-secondary)]">{listing.features}</p>
            </div>
          )}

          {listing.description && (
            <div className="mt-5">
              <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-medium mb-1">Описание</p>
              <p className="text-[var(--text-secondary)] leading-relaxed">{listing.description}</p>
            </div>
          )}

          {listing.contact && !isClosed && (
            <div className="mt-6 bg-[var(--accent-light)] border border-[var(--accent)]/20 rounded-xl px-5 py-4">
              <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider font-medium">Контакт</p>
              <p className="font-bold text-lg mt-0.5 text-[var(--accent)]">{listing.contact}</p>
            </div>
          )}

          <div className="flex flex-wrap gap-3 items-center mt-6">
            {listing.telegram_post_url && (
              <a href={listing.telegram_post_url} target="_blank" rel="noopener noreferrer" className="btn-primary px-5 py-2.5 text-sm">
                Открыть в Telegram
              </a>
            )}
            {!isClosed && <CloseButton listingId={listing.id} />}
          </div>

          <p className="text-xs text-[var(--text-muted)] mt-8">{createdDate}</p>
        </div>
      </div>
    </div>
  );
}
