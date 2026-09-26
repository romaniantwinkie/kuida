"use client";

import { AdvancedMap } from "@/components/ui/interactive-map";
import { useI18n } from "@/components/language-provider";
import type { GeocodeSuggestion } from "@/lib/demo-geocoder";
import { caregiverArea, caregiverWindow, MOCK_CAREGIVERS, type MockCaregiver } from "@/lib/mock-caregivers";

const MIAMI: [number, number] = [25.7617, -80.1918];

export function AgencyMap({
  caregivers = MOCK_CAREGIVERS,
  selectedId = null,
  center = MIAMI,
  address = null,
  onSelect,
}: {
  caregivers?: MockCaregiver[];
  selectedId?: string | null;
  center?: [number, number];
  address?: GeocodeSuggestion | null;
  onSelect?: (id: string) => void;
}) {
  const { locale } = useI18n();
  const markers = caregivers.map((caregiver) => ({
    id: caregiver.id,
    position: [caregiver.lat, caregiver.lng] as [number, number],
    color: caregiver.id === selectedId ? "blue" : "grey",
    size: caregiver.id === selectedId ? ("large" as const) : ("medium" as const),
    popup: {
      title: `${caregiver.firstName} ${caregiver.lastInitial}. · ${caregiver.role}`,
      content: `${caregiverArea(caregiver, locale)} · ${caregiverWindow(caregiver, locale)}`,
    },
  }));

  if (address) {
    markers.push({
      id: `address-${address.id}`,
      position: [address.lat, address.lng],
      color: "red",
      size: "medium",
      popup: { title: address.label, content: "" },
    });
  }

  return (
    <AdvancedMap
      key={`${center[0]}-${center[1]}`}
      center={center}
      zoom={address ? 13 : 11}
      enableClustering={false}
      enableSearch={false}
      enableControls={false}
      className="h-full w-full"
      style={{ height: "100%", width: "100%" }}
      markers={markers}
      onMarkerClick={(marker) => {
        if (marker.id && !marker.id.startsWith("address-")) onSelect?.(marker.id);
      }}
    />
  );
}
