"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";
import { Listing, TYPE_LABELS } from "@/lib/types";
import { supabase } from "@/lib/supabase";

const ICON_COLORS: Record<string, string> = {
  lost: "#ef4444",
  found: "#22c55e",
  give_away: "#3b82f6",
};

function createIcon(type: string) {
  const color = ICON_COLORS[type] || "#6b7280";
  return L.divIcon({
    className: "",
    html: `<div style="background:${color};width:24px;height:24px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
}

export default function MapView() {
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("listings")
        .select("*")
        .eq("moderation_status", "approved")
        .eq("status", "active")
        .not("lat", "is", null)
        .not("lng", "is", null)
        .limit(100);
      setListings((data as Listing[]) || []);
    }
    load();
  }, []);

  return (
    <MapContainer
      center={[53.9, 27.5667]}
      zoom={12}
      style={{ height: "400px", width: "100%", borderRadius: "12px" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {listings.map((listing) => (
        <Marker
          key={listing.id}
          position={[listing.lat!, listing.lng!]}
          icon={createIcon(listing.type)}
        >
          <Popup>
            <div className="text-sm">
              <strong>{TYPE_LABELS[listing.type]}</strong>
              <br />
              {listing.animal}
              {listing.breed && `, ${listing.breed}`}
              <br />
              <Link
                href={`/listings/${listing.id}`}
                className="text-orange-500 underline"
              >
                Подробнее
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
