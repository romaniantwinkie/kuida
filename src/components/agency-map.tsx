"use client";

import { AdvancedMap } from "@/components/ui/interactive-map";
import { useI18n } from "@/components/language-provider";
import { caregiverArea, caregiverWindow, MOCK_CAREGIVERS } from "@/lib/mock-caregivers";

const MIAMI: [number, number] = [25.7617, -80.1918];

export function AgencyMap() {
  const { locale } = useI18n();

  return (
    <AdvancedMap
      center={MIAMI}
      zoom={11}
      enableClustering={false}
      enableSearch={false}
      enableControls={false}
      className="h-full w-full"
      style={{ height: "100%", width: "100%" }}
      markers={MOCK_CAREGIVERS.map((caregiver) => ({
        id: caregiver.id,
        position: [caregiver.lat, caregiver.lng],
        color: "black",
        size: "medium" as const,
        popup: {
          title: `${caregiver.firstName} ${caregiver.lastInitial}. · ${caregiver.role}`,
          content: `${caregiverArea(caregiver, locale)} · ${caregiverWindow(caregiver, locale)}`,
        },
      }))}
    />
  );
}
