"use client";

import { Suspense, useEffect, useState, useCallback, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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
        <div className="text-center py-12 text-[var(--text-muted)]">Загрузка...</div>
      }
    >
      <ListingsContent />
    </Suspense>
  );
}

const TYPE_BUTTONS = [
  { key: "lost", label: "Пропал", color: "var(--red)" },
  { key: "found", label: "Найден", color: "var(--green)" },
  { key: "give_away", label: "Ищет дом", color: "var(--blue)" },
  { key: "help", label: "Нужна помощь", color: "var(--amber)" },
];

function ListingsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Filter state
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

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const breedOptions = useMemo(() => {
    if (animals.length === 1 && animals[0] === "кошка")
      return BREED_OPTIONS_CAT;
    if (animals.length === 1 && animals[0] === "собака")
      return BREED_OPTIONS_DOG;
    return [...new Set([...BREED_OPTIONS_CAT, ...BREED_OPTIONS_DOG])].sort();
  }, [animals]);

  // Reset breeds when animal changes
  useEffect(() => {
    setBreeds([]);
  }, [animals]);

  // Sync filters to URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (types.length) params.set("type", types.join(","));
    if (animals.length) params.set("animal", animals.join(","));
    if (debouncedSearch) params.set("q", debouncedSearch);
    const url = params.toString() ? `?${params.toString()}` : "/listings";
    router.replace(url, { scroll: false });
  }, [types, animals, debouncedSearch, router]);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from("listings")
      .select("*")
      .eq("moderation_status", "approved")
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(200);

    if (types.length > 0) query = query.in("type", types);
    if (animals.length > 0) query = query.in("animal", animals);
    if (districts.length > 0) query = query.in("district", districts);
    if (ages.length > 0) query = query.in("age", ages);
    if (sexes.length > 0) query = query.in("sex", sexes);

    // breed & color: exact match with in()
    if (breeds.length > 0) query = query.in("breed", breeds);
    if (colors.length > 0) query = query.in("color", colors);

    // text search
    if (debouncedSearch) {
      query = query.or(
        `name.ilike.%${debouncedSearch}%,description.ilike.%${debouncedSearch}%,breed.ilike.%${debouncedSearch}%,features.ilike.%${debouncedSearch}%`
      );
    }

    const { data } = await query;
    setListings((data as Listing[]) || []);
    setLoading(false);
  }, [types, animals, breeds, colors, ages, sexes, districts, debouncedSearch]);

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
    districts.length > 0 ||
    debouncedSearch.length > 0;

  // Count active filter tags
  const activeFilterCount =
    breeds.length + colors.length + ages.length + sexes.length + districts.length;

  function resetFilters() {
    setTypes([]);
    setAnimals([]);
    setBreeds([]);
    setColors([]);
    setAges([]);
    setSexes([]);
    setDistricts([]);
    setSearch("");
    setDebouncedSearch("");
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        <span className="gradient-text">Все объявления</span>
      </h1>

      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по кличке, породе, описанию..."
            className="w-full surface rounded-lg pl-10 pr-10 py-2.5 text-sm bg-[var(--bg-card)] transition-all"
          />
          {search && (
            <button
              onClick={() => { setSearch(""); setDebouncedSearch(""); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text)]"
            >
              &times;
            </button>
          )}
        </div>
      </div>

      {/* Type filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        {TYPE_BUTTONS.map(({ key, label, color }) => {
          const active = types.includes(key);
          return (
            <button
              key={key}
              onClick={() => setTypes(active ? types.filter((t) => t !== key) : [...types, key])}
              className="surface rounded-lg px-4 py-2 text-sm font-medium transition-all flex items-center gap-2"
              style={active ? { borderColor: color, color, background: `color-mix(in srgb, ${color} 10%, transparent)` } : {}}
            >
              <span className="w-2 h-2 rounded-full" style={{ background: color }} />
              {label}
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="surface rounded-xl p-3 mb-4 relative z-[100]">
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
              className="text-sm text-[var(--accent)] hover:text-[var(--accent-hover)] px-3 py-2 font-medium transition-colors"
            >
              Сбросить
            </button>
          )}
        </div>
      </div>

      {/* Active filter tags */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {[...breeds, ...colors, ...ages, ...sexes, ...districts].map(
            (tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 bg-[var(--accent-dim)] text-[var(--accent)] text-xs font-medium px-2.5 py-1 rounded-md"
              >
                {tag}
                <button
                  onClick={() => {
                    setBreeds((v) => v.filter((x) => x !== tag));
                    setColors((v) => v.filter((x) => x !== tag));
                    setAges((v) => v.filter((x) => x !== tag));
                    setSexes((v) => v.filter((x) => x !== tag));
                    setDistricts((v) => v.filter((x) => x !== tag));
                  }}
                  className="opacity-60 hover:opacity-100"
                >
                  ✕
                </button>
              </span>
            )
          )}
        </div>
      )}

      {/* Results */}
      {loading ? (
        <div className="text-center py-12 text-gray-500 animate-pulse-soft">
          Загрузка...
        </div>
      ) : listings.length > 0 ? (
        <>
          <p className="text-sm text-[var(--text-muted)] mb-4">
            {listings.length} объявлений
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </>
      ) : (
        <div className="surface rounded-xl text-center py-20 text-[var(--text-muted)]">
          <p className="text-lg">Ничего не найдено</p>
          <p className="text-sm mt-1">Попробуйте изменить фильтры</p>
        </div>
      )}
    </div>
  );
}
