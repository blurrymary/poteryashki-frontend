"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  Listing,
  ListingType,
  TYPE_LABELS,
  ANIMAL_OPTIONS,
  MINSK_DISTRICTS,
} from "@/lib/types";
import ListingCard from "@/components/ListingCard";

export default function ListingsPage() {
  return (
    <Suspense fallback={<div className="text-center py-12 text-gray-500">Загрузка...</div>}>
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
  const [district, setDistrict] = useState("");

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

    const { data } = await query;
    setListings((data as Listing[]) || []);
    setLoading(false);
  }, [type, animal, breed, color, district]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  // Debounced text inputs
  const [breedInput, setBreedInput] = useState("");
  const [colorInput, setColorInput] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setBreed(breedInput), 400);
    return () => clearTimeout(timer);
  }, [breedInput]);

  useEffect(() => {
    const timer = setTimeout(() => setColor(colorInput), 400);
    return () => clearTimeout(timer);
  }, [colorInput]);

  const hasFilters = type || animal || breed || color || district;

  function resetFilters() {
    setType("");
    setAnimal("");
    setBreedInput("");
    setColorInput("");
    setBreed("");
    setColor("");
    setDistrict("");
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Все объявления</h1>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
        <div className="flex flex-wrap gap-3">
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

          <input
            type="text"
            value={breedInput}
            onChange={(e) => setBreedInput(e.target.value)}
            placeholder="Порода"
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white w-36"
          />

          <input
            type="text"
            value={colorInput}
            onChange={(e) => setColorInput(e.target.value)}
            placeholder="Цвет / окрас"
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white w-36"
          />

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

          {hasFilters && (
            <button
              onClick={resetFilters}
              className="text-sm text-gray-500 hover:text-gray-700 px-3 py-2 underline"
            >
              Сбросить
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
        <div className="text-center py-12 text-gray-500">
          <p className="text-4xl mb-3">🔍</p>
          <p>Ничего не найдено. Попробуйте изменить фильтры.</p>
        </div>
      )}
    </div>
  );
}
