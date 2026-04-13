"use client";

import { Suspense, useEffect, useState, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  Listing,
  ListingType,
  TYPE_LABELS,
  ANIMAL_OPTIONS,
  BREED_OPTIONS_CAT,
  BREED_OPTIONS_DOG,
  COLOR_OPTIONS,
  AGE_OPTIONS,
  MINSK_DISTRICTS,
} from "@/lib/types";
import ListingCard from "@/components/ListingCard";

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

function ListingsContent() {
  const searchParams = useSearchParams();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState<ListingType | "">(
    (searchParams.get("type") as ListingType) || ""
  );
  const [animal, setAnimal] = useState("");
  const [breed, setBreed] = useState("");
  const [color, setColor] = useState("");
  const [age, setAge] = useState("");
  const [district, setDistrict] = useState("");

  const breedOptions = useMemo(() => {
    if (animal === "кошка") return BREED_OPTIONS_CAT;
    if (animal === "собака") return BREED_OPTIONS_DOG;
    return [...new Set([...BREED_OPTIONS_CAT, ...BREED_OPTIONS_DOG])].sort();
  }, [animal]);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from("listings")
      .select("*")
      .eq("moderation_status", "approved")
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(50);

    if (type) query = query.eq("type", type);
    if (animal) query = query.eq("animal", animal);
    if (district) query = query.eq("district", district);
    if (breed) query = query.ilike("breed", `%${breed}%`);
    if (color) query = query.ilike("color", `%${color}%`);
    if (age) query = query.eq("age", age);

    const { data } = await query;
    setListings((data as Listing[]) || []);
    setLoading(false);
  }, [type, animal, breed, color, age, district]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  // Reset breed when animal changes
  useEffect(() => {
    setBreed("");
  }, [animal]);

  const hasFilters = type || animal || breed || color || age || district;

  function resetFilters() {
    setType("");
    setAnimal("");
    setBreed("");
    setColor("");
    setAge("");
    setDistrict("");
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Все объявления</h1>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <select
            value={type}
            onChange={(e) => setType(e.target.value as ListingType | "")}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
          >
            <option value="">Все типы</option>
            {(Object.keys(TYPE_LABELS) as ListingType[]).map((t) => (
              <option key={t} value={t}>
                {TYPE_LABELS[t]}
              </option>
            ))}
          </select>

          <select
            value={animal}
            onChange={(e) => setAnimal(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
          >
            <option value="">Все животные</option>
            {ANIMAL_OPTIONS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>

          <select
            value={breed}
            onChange={(e) => setBreed(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
          >
            <option value="">Все породы</option>
            {breedOptions.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>

          <select
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
          >
            <option value="">Все окрасы</option>
            {COLOR_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
          >
            <option value="">Любой возраст</option>
            {AGE_OPTIONS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>

          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
          >
            <option value="">Все районы</option>
            {MINSK_DISTRICTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {hasFilters && (
          <button
            onClick={resetFilters}
            className="mt-3 text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Сбросить все фильтры
          </button>
        )}
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
        <div className="text-center py-12 text-gray-500">
          <p className="text-4xl mb-3">🔍</p>
          <p>Ничего не найдено. Попробуйте изменить фильтры.</p>
        </div>
      )}
    </div>
  );
}
