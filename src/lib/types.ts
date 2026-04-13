export type ListingType = "lost" | "found" | "give_away";
export type ListingStatus = "active" | "closed";
export type ModerationStatus = "pending" | "approved" | "rejected";

export interface Listing {
  id: string;
  type: ListingType;
  animal: string;
  breed: string | null;
  color: string | null;
  name: string | null;
  city: string;
  district: string | null;
  features: string | null;
  description: string | null;
  contact: string | null;
  photo_url: string | null;
  status: ListingStatus;
  source: "manual" | "telegram";
  telegram_post_url: string | null;
  telegram_channel: string | null;
  lat: number | null;
  lng: number | null;
  moderation_status: ModerationStatus;
  created_at: string;
  updated_at: string;
}

export const TYPE_LABELS: Record<ListingType, string> = {
  lost: "Пропал",
  found: "Найден",
  give_away: "Отдам в добрые руки",
};

export const TYPE_COLORS: Record<ListingType, string> = {
  lost: "bg-red-500",
  found: "bg-green-500",
  give_away: "bg-blue-500",
};

export const ANIMAL_OPTIONS = ["кошка", "собака", "другое"] as const;

export const MINSK_DISTRICTS = [
  "Заводской",
  "Ленинский",
  "Московский",
  "Октябрьский",
  "Партизанский",
  "Первомайский",
  "Советский",
  "Фрунзенский",
  "Центральный",
] as const;
