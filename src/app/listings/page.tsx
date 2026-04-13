"use client";

import { useEffect, useState } from "react";
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
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState<ListingType | "">("");
  const [animal, setAnimal] = useState("");
  const [district, setDistrict] = useState("");

  useEffect(() => {
    fetchListings();
  }, [type, animal, district]);

  async function fetchListings() {
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

    const { data } = await query;
    setListings((data as Listing[]) || []);
    setLoading(false);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Все объявления</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
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

      {/* Results */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Загрузка...</div>
      ) : listings.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <p className="text-4xl mb-3">🔍</p>
          <p>Ничего не найдено. Попробуйте изменить фильтры.</p>
        </div>
      )}
    </div>
  );
}
