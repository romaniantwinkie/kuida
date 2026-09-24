"use client";

import { Globe3D, type GlobeMarker } from "@/components/ui/3d-globe";

const MARKERS: GlobeMarker[] = [
  { lat: 25.7617, lng: -80.1918, src: "/globe-pin.svg", label: "Miami" },
  { lat: 33.749, lng: -84.388, src: "/globe-pin.svg", label: "Atlanta" },
  { lat: 32.7767, lng: -96.797, src: "/globe-pin.svg", label: "Dallas" },
  { lat: 41.8781, lng: -87.6298, src: "/globe-pin.svg", label: "Chicago" },
  { lat: 40.7128, lng: -74.006, src: "/globe-pin.svg", label: "New York" },
  { lat: 34.0522, lng: -118.2437, src: "/globe-pin.svg", label: "Los Angeles" },
];

export function AgencyGlobe() {
  return (
    <Globe3D
      className="h-[22rem] sm:h-[28rem]"
      markers={MARKERS}
      config={{
        autoRotateSpeed: 0.35,
        enableZoom: false,
        enablePan: false,
        showAtmosphere: false,
        ambientIntensity: 0.85,
        pointLightIntensity: 1.15,
      }}
    />
  );
}
