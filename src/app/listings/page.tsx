"use client";

import { Suspense, useEffect, useState, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  Listing,
  ListingType,
  TYPE_LABELS,
  ANIMAL_OPTIONS,
  SEX_OPTIONS,
  BREED_OPTIONS_CAT,
  BREED_OPTIONS_DOG,
  COLOR_OPTIONS,
  AGE_OPTIONS,
  MINSK_DISTRICTS,
} from "@/lib/types";
import ListingCard from "@/components/ListingCard";
import MultiSelect from "@/components/MultiSelect";

export default function ListingsPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center py-12 text-gray-500">Загрузка...</div>
      }
    >
      <ListingsContent />
    </Suspense>
  );
}

const TYPE_BUTTONS = [
  {
    key: "lost",
    label: "Пропал",
    icon: "🔍",
    desc: "Хозяин ищет питомца",
    activeClass: "badge-lost",
    inactiveClass: "glass text-red-500 hover:bg-red-50",
  },
  {
    key: "found",
    label: "Найден",
    icon: "📦",
    desc: "Найдено животное, ищем хозяина",
    activeClass: "badge-found",
    inactiveClass: "glass text-green-600 hover:bg-green-50",
  },
  {
    key: "give_away",
    label: "Ищет дом",
    icon: "💝",
    desc: "Отдают в добрые руки",
    activeClass: "badge-give",
    inactiveClass: "glass text-blue-500 hover:bg-blue-50",
  },
  {
    key: "help",
    label: "Нужна помощь",
    icon: "🩺",
    desc: "Донор крови, сбор на лечение",
    activeClass: "badge-help",
    inactiveClass: "glass text-amber-600 hover:bg-amber-50",
  },
];

function ListingsContent() {
  const searchParams = useSearchParams();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter state — all arrays for multi-select
  const [types, setTypes] = useState<string[]>(() => {
    const t = searchParams.get("type");
    return t ? [t] : [];
  });
  const [animals, setAnimals] = useState<string[]>([]);
  const [breeds, setBreeds] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [ages, setAges] = useState<string[]>([]);
  const [sexes, setSexes] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);

  const breedOptions = useMemo(() => {
    if (animals.length === 1 && animals[0] === "кошка")
      return BREED_OPTIONS_CAT;
    if (animals.length === 1 && animals[0] === "собака")
      return BREED_OPTIONS_DOG;
    return [
      ...new Set([...BREED_OPTIONS_CAT, ...BREED_OPTIONS_DOG]),
    ].sort();
  }, [animals]);

  // Reset breeds when animal changes
  useEffect(() => {
    setBreeds([]);
  }, [animals]);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from("listings")
      .select("*")
      .eq("moderation_status", "approved")
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(50);

    if (types.length > 0) query = query.in("type", types);
    if (animals.length > 0) query = query.in("animal", animals);
    if (districts.length > 0) query = query.in("district", districts);
    if (ages.length > 0) query = query.in("age", ages);
    if (sexes.length > 0) query = query.in("sex", sexes);

    // breed & color: use ilike with OR for multi-select
    if (breeds.length > 0) {
      query = query.or(
        breeds.map((b) => `breed.ilike.%${b}%`).join(",")
      );
    }
    if (colors.length > 0) {
      query = query.or(
        colors.map((c) => `color.ilike.%${c}%`).join(",")
      );
    }

    const { data } = await query;
    setListings((data as Listing[]) || []);
    setLoading(false);
  }, [types, animals, breeds, colors, ages, sexes, districts]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const hasFilters =
    types.length > 0 ||
    animals.length > 0 ||
    breeds.length > 0 ||
    colors.length > 0 ||
    ages.length > 0 ||
    sexes.length > 0 ||
    districts.length > 0;

  function resetFilters() {
    setTypes([]);
    setAnimals([]);
    setBreeds([]);
    setColors([]);
    setAges([]);
    setSexes([]);
    setDistricts([]);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        <span className="gradient-text">Все объявления</span>
      </h1>

      {/* Type filter — always visible pills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {TYPE_BUTTONS.map(({ key, label, icon, activeClass, inactiveClass }) => {
          const active = types.includes(key);
          return (
            <button
              key={key}
              onClick={() =>
                setTypes(active ? types.filter((t) => t !== key) : [...types, key])
              }
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-1.5 ${
                active
                  ? `${activeClass} text-white shadow-md scale-105`
                  : `${inactiveClass} hover:scale-105`
              }`}
            >
              <span>{icon}</span> {label}
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="glass rounded-2xl p-4 mb-6 relative z-[100]">
        <div className="flex flex-wrap gap-3 items-start">
          <MultiSelect
            label="Животное"
            options={[...ANIMAL_OPTIONS]}
            selected={animals}
            onChange={setAnimals}
          />

          <MultiSelect
            label="Порода"
            options={[...breedOptions]}
            selected={breeds}
            onChange={setBreeds}
          />

          <MultiSelect
            label="Окрас"
            options={[...COLOR_OPTIONS]}
            selected={colors}
            onChange={setColors}
          />

          <MultiSelect
            label="Возраст"
            options={[...AGE_OPTIONS]}
            selected={ages}
            onChange={setAges}
          />

          <MultiSelect
            label="Пол"
            options={[...SEX_OPTIONS]}
            selected={sexes}
            onChange={setSexes}
          />

          <MultiSelect
            label="Район"
            options={[...MINSK_DISTRICTS]}
            selected={districts}
            onChange={setDistricts}
          />

          {hasFilters && (
            <button
              onClick={resetFilters}
              className="text-sm text-violet-500 hover:text-violet-700 px-3 py-2 font-medium"
            >
              ✕ Сбросить все
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Загрузка...</div>
      ) : listings.length > 0 ? (
        <>
          <p className="text-sm text-gray-500 mb-4">
            Найдено: {listings.length} объявлений
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </>
      ) : (
        <div className="glass rounded-2xl text-center py-16 text-gray-500">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-lg font-medium">Ничего не найдено. Попробуйте изменить фильтры.</p>
        </div>
      )}
    </div>
  );
}
