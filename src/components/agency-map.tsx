"use client";

import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useI18n } from "@/components/language-provider";
import { caregiverArea, caregiverWindow, MOCK_CAREGIVERS } from "@/lib/mock-caregivers";

const MIAMI: [number, number] = [25.7617, -80.1918];

export function AgencyMap() {
  const { locale } = useI18n();

  return (
    <MapContainer
      center={MIAMI}
      zoom={11}
      scrollWheelZoom={false}
      className="h-full w-full"
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {MOCK_CAREGIVERS.map((caregiver) => (
        <CircleMarker
          key={caregiver.id}
          center={[caregiver.lat, caregiver.lng]}
          radius={8}
          pathOptions={{ color: "#000", weight: 1, fillColor: "#000", fillOpacity: 0.9 }}
        >
          <Popup>
            <strong>
              {caregiver.firstName} {caregiver.lastInitial}. · {caregiver.role}
            </strong>
            <br />
            {caregiverArea(caregiver, locale)}
            <br />
            {caregiverWindow(caregiver, locale)}
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
