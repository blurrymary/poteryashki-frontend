export type ListingType = "lost" | "found" | "give_away" | "help";
export type ListingStatus = "active" | "closed";
export type ModerationStatus = "pending" | "approved" | "rejected";

export interface Listing {
  id: string;
  type: ListingType;
  animal: string;
  breed: string | null;
  color: string | null;
  age: string | null;
  sex: string | null;
  event_date: string | null;
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
  help: "Нужна помощь",
};

export const TYPE_COLORS: Record<ListingType, string> = {
  lost: "bg-red-500",
  found: "bg-green-500",
  give_away: "bg-blue-500",
  help: "bg-amber-500",
};

export const ANIMAL_OPTIONS = ["кошка", "собака", "другое"] as const;

export const SEX_OPTIONS = ["мальчик", "девочка"] as const;

export const BREED_OPTIONS_CAT = [
  "Дворовая",
  "Метис",
  "Британская",
  "Шотландская вислоухая",
  "Мейн-кун",
  "Сиамская",
  "Персидская",
  "Сфинкс",
  "Бенгальская",
  "Русская голубая",
  "Абиссинская",
  "Невская маскарадная",
  "Другая",
] as const;

export const BREED_OPTIONS_DOG = [
  "Дворняжка",
  "Метис",
  "Немецкая овчарка",
  "Лабрадор",
  "Хаски",
  "Джек-рассел-терьер",
  "Йоркширский терьер",
  "Чихуахуа",
  "Такса",
  "Шпиц",
  "Французский бульдог",
  "Корги",
  "Бигль",
  "Алабай",
  "Стаффордширский терьер",
  "Пудель",
  "Другая",
] as const;

export const COLOR_OPTIONS = [
  "Чёрный",
  "Белый",
  "Рыжий",
  "Серый",
  "Коричневый",
  "Чёрно-белый",
  "Трёхцветный",
  "Полосатый (табби)",
  "Кремовый",
  "Дымчатый",
  "Другой",
] as const;

export const AGE_OPTIONS = [
  "до 6 месяцев",
  "6–12 месяцев",
  "1–3 года",
  "3–5 лет",
  "5–10 лет",
  "старше 10 лет",
] as const;

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
