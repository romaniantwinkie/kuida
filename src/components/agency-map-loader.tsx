"use client";

import dynamic from "next/dynamic";
import type { GeocodeSuggestion } from "@/lib/demo-geocoder";
import type { MockCaregiver } from "@/lib/mock-caregivers";

const AgencyMap = dynamic(() => import("@/components/agency-map").then((mod) => mod.AgencyMap), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-muted" aria-hidden />,
});

export function AgencyMapLoader({
  caregivers,
  selectedId,
  center,
  address,
  onSelect,
}: {
  caregivers?: MockCaregiver[];
  selectedId?: string | null;
  center?: [number, number];
  address?: GeocodeSuggestion | null;
  onSelect?: (id: string) => void;
}) {
  return <AgencyMap caregivers={caregivers} selectedId={selectedId} center={center} address={address} onSelect={onSelect} />;
}
