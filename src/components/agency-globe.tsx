"use client";

import { Globe3D, type GlobeMarker } from "@/components/ui/3d-globe";
import { MOCK_CAREGIVERS } from "@/lib/mock-caregivers";

// Spread so each name stays readable on a world globe. Real coordinates are all in Miami.
const SPREAD: [number, number][] = [
  [25.76, -80.19],
  [29.2, -82.6],
  [33.5, -84.4],
  [36.1, -79.8],
  [32.4, -90.2],
  [30.0, -95.4],
  [35.2, -90.0],
  [39.0, -84.5],
  [37.5, -77.5],
  [41.5, -87.6],
];

const MARKERS: GlobeMarker[] = MOCK_CAREGIVERS.map((caregiver, index) => {
  const [lat, lng] = SPREAD[index] ?? [caregiver.lat, caregiver.lng];
  return {
    lat,
    lng,
    src: "/globe-pin.svg",
    label: `${caregiver.firstName} ${caregiver.lastInitial}.`,
  };
});

export function AgencyGlobe() {
  return (
    <Globe3D
      className="mx-auto h-80 w-full max-w-3xl sm:h-96"
      markers={MARKERS}
      config={{
        radius: 2,
        autoRotateSpeed: 0.2,
        enableZoom: false,
        enablePan: false,
        showAtmosphere: false,
        ambientIntensity: 0.85,
        pointLightIntensity: 1.15,
        minDistance: 4,
        maxDistance: 12,
      }}
    />
  );
}
