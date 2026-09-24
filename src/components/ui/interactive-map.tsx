"use client";

import React, { useState, useEffect, useCallback, type CSSProperties } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  Polygon,
  Polyline,
  useMap,
  useMapEvents,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

// 21st.dev @lovesickfromthe6ix/interactive-map (AdvancedMap).
// Fix for default markers in React-Leaflet.
const iconDefault = L.Icon.Default.prototype as unknown as { _getIconUrl?: string };
delete iconDefault._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdn.21st.dev/assets/mirror/00/00179c4c1ee830d3a108412ae0d294f55776cfeb085c60129a39aa6fc4ae2528.png",
  iconUrl:
    "https://cdn.21st.dev/assets/mirror/57/574c3a5cca85f4114085b6841596d62f00d7c892c7b03f28cbfa301deb1dc437.png",
  shadowUrl:
    "https://cdn.21st.dev/assets/mirror/26/264f5c640339f042dd729062cfc04c17f8ea0f29882b538e3848ed8f10edb4da.png",
});

type MarkerSize = "small" | "medium" | "large";

const createCustomIcon = (color = "blue", size: MarkerSize = "medium") => {
  const sizes: Record<MarkerSize, [number, number]> = {
    small: [20, 32],
    medium: [25, 41],
    large: [30, 50],
  };

  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl:
      "https://cdn.21st.dev/assets/mirror/26/264f5c640339f042dd729062cfc04c17f8ea0f29882b538e3848ed8f10edb4da.png",
    iconSize: sizes[size],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
};

export type AdvancedMapMarker = {
  id?: string;
  position: L.LatLngExpression;
  color?: string;
  size?: MarkerSize;
  icon?: L.Icon;
  popup?: {
    title?: string;
    content?: string;
    image?: string;
  };
};

type MapShape = {
  id?: string;
  positions: L.LatLngExpression[] | L.LatLngExpression[][];
  style?: L.PathOptions;
  popup?: string;
};

type MapCircle = {
  id?: string;
  center: L.LatLngExpression;
  radius: number;
  style?: L.PathOptions;
  popup?: string;
};

export type AdvancedMapProps = {
  center?: L.LatLngExpression;
  zoom?: number;
  markers?: AdvancedMapMarker[];
  polygons?: MapShape[];
  circles?: MapCircle[];
  polylines?: MapShape[];
  onMarkerClick?: (marker: AdvancedMapMarker) => void;
  onMapClick?: (latlng: L.LatLng) => void;
  enableClustering?: boolean;
  enableSearch?: boolean;
  enableControls?: boolean;
  enableDrawing?: boolean;
  mapLayers?: {
    openstreetmap?: boolean;
    satellite?: boolean;
    traffic?: boolean;
  };
  className?: string;
  style?: CSSProperties;
};

const MapEvents = ({
  onMapClick,
  onLocationFound,
}: {
  onMapClick?: (latlng: L.LatLng) => void;
  onLocationFound?: (latlng: L.LatLng) => void;
}) => {
  const map = useMapEvents({
    click: (e) => {
      onMapClick?.(e.latlng);
    },
    locationfound: (e) => {
      onLocationFound?.(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return null;
};

const CustomControls = ({
  onLocate,
  onToggleLayer,
}: {
  onLocate: () => void;
  onToggleLayer: (layerType: "satellite" | "traffic") => void;
  layers?: AdvancedMapProps["mapLayers"];
}) => {
  const map = useMap();

  useEffect(() => {
    const control = new L.Control({ position: "topright" });

    control.onAdd = () => {
      const div = L.DomUtil.create("div", "custom-controls");
      div.innerHTML = `
        <div style="background: white; padding: 10px; border-radius: 5px; box-shadow: 0 2px 10px rgba(0,0,0,0.2);">
          <button id="locate-btn" style="margin: 2px; padding: 8px; border: none; border-radius: 3px; cursor: pointer;">📍 Locate Me</button>
          <button id="satellite-btn" style="margin: 2px; padding: 8px; border: none; border-radius: 3px; cursor: pointer;">🛰️ Satellite</button>
          <button id="traffic-btn" style="margin: 2px; padding: 8px; border: none; border-radius: 3px; cursor: pointer;">🚦 Traffic</button>
        </div>
      `;

      L.DomEvent.disableClickPropagation(div);

      const locateBtn = div.querySelector("#locate-btn");
      const satelliteBtn = div.querySelector("#satellite-btn");
      const trafficBtn = div.querySelector("#traffic-btn");

      if (locateBtn instanceof HTMLButtonElement) locateBtn.onclick = () => onLocate();
      if (satelliteBtn instanceof HTMLButtonElement) satelliteBtn.onclick = () => onToggleLayer("satellite");
      if (trafficBtn instanceof HTMLButtonElement) trafficBtn.onclick = () => onToggleLayer("traffic");

      return div;
    };

    control.addTo(map);

    return () => {
      control.remove();
    };
  }, [map, onLocate, onToggleLayer]);

  return null;
};

const SearchControl = ({ onSearch }: { onSearch?: (result: { latLng: L.LatLngExpression; name: string }) => void }) => {
  const map = useMap();

  useEffect(() => {
    const control = new L.Control({ position: "topleft" });
    let query = "";

    const handleSearch = async () => {
      if (!query.trim()) return;

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`,
        );
        const results = (await response.json()) as { lat: string; lon: string; display_name: string }[];

        if (results.length > 0) {
          const { lat, lon, display_name } = results[0];
          const latLng: L.LatLngExpression = [parseFloat(lat), parseFloat(lon)];
          map.flyTo(latLng, 13);
          onSearch?.({ latLng, name: display_name });
        }
      } catch (error) {
        console.error("Search error:", error);
      }
    };

    control.onAdd = () => {
      const div = L.DomUtil.create("div", "search-control");
      div.innerHTML = `
        <div style="background: white; padding: 10px; border-radius: 5px; box-shadow: 0 2px 10px rgba(0,0,0,0.2); display: flex; gap: 5px;">
          <input
            id="search-input"
            type="text"
            placeholder="Search places..."
            style="padding: 8px; border: 1px solid #ddd; border-radius: 3px; width: 200px;"
          />
          <button
            id="search-btn"
            style="padding: 8px 12px; border: none; border-radius: 3px; cursor: pointer; background: #007bff; color: white;"
          >
            🔍
          </button>
        </div>
      `;

      L.DomEvent.disableClickPropagation(div);

      const input = div.querySelector("#search-input");
      const button = div.querySelector("#search-btn");

      input?.addEventListener("input", (event) => {
        query = event.target instanceof HTMLInputElement ? event.target.value : "";
      });
      input?.addEventListener("keypress", (event) => {
        if (event instanceof KeyboardEvent && event.key === "Enter") void handleSearch();
      });
      button?.addEventListener("click", () => void handleSearch());

      return div;
    };

    control.addTo(map);

    return () => {
      control.remove();
    };
  }, [map, onSearch]);

  return null;
};

function MarkerList({
  markers,
  onMarkerClick,
}: {
  markers: AdvancedMapMarker[];
  onMarkerClick?: (marker: AdvancedMapMarker) => void;
}) {
  return markers.map((marker, index) => (
    <Marker
      key={marker.id || index}
      position={marker.position}
      icon={marker.icon || createCustomIcon(marker.color, marker.size)}
      eventHandlers={{
        click: () => onMarkerClick?.(marker),
      }}
    >
      {marker.popup ? (
        <Popup>
          <div>
            {marker.popup.title ? <strong>{marker.popup.title}</strong> : null}
            {marker.popup.content ? <p>{marker.popup.content}</p> : null}
            {marker.popup.image ? (
              // Remote marker photos are part of the 21st popup API.
              // eslint-disable-next-line @next/next/no-img-element
              <img src={marker.popup.image} alt={marker.popup.title ?? ""} style={{ maxWidth: "100%", height: "auto" }} />
            ) : null}
          </div>
        </Popup>
      ) : null}
    </Marker>
  ));
}

export const AdvancedMap = ({
  center = [51.505, -0.09],
  zoom = 13,
  markers = [],
  polygons = [],
  circles = [],
  polylines = [],
  onMarkerClick,
  onMapClick,
  enableClustering = true,
  enableSearch = true,
  enableControls = true,
  enableDrawing: _enableDrawing = false,
  mapLayers = {
    openstreetmap: true,
    satellite: false,
    traffic: false,
  },
  className = "",
  style = { height: "500px", width: "100%" },
}: AdvancedMapProps) => {
  const [currentLayers, setCurrentLayers] = useState(mapLayers);
  const [userLocation, setUserLocation] = useState<L.LatLngExpression | null>(null);
  const [searchResult, setSearchResult] = useState<{ latLng: L.LatLngExpression; name: string } | null>(null);
  const [clickedLocation, setClickedLocation] = useState<L.LatLng | null>(null);

  const handleToggleLayer = useCallback((layerType: "satellite" | "traffic") => {
    setCurrentLayers((prev) => ({
      ...prev,
      [layerType]: !prev[layerType],
    }));
  }, []);

  const handleLocate = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
        },
        (error) => {
          console.error("Geolocation error:", error);
        },
      );
    }
  }, []);

  const handleMapClick = useCallback(
    (latlng: L.LatLng) => {
      setClickedLocation(latlng);
      onMapClick?.(latlng);
    },
    [onMapClick],
  );

  const handleSearch = useCallback((result: { latLng: L.LatLngExpression; name: string }) => {
    setSearchResult(result);
  }, []);

  const markerNodes = <MarkerList markers={markers} onMarkerClick={onMarkerClick} />;

  return (
    <div className={`advanced-map ${className}`} style={style}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        // Keep page scroll working when the pointer is over the map.
        scrollWheelZoom={false}
      >
        {currentLayers.openstreetmap ? (
          // CARTO basemaps now require an API key, and tile.openstreetmap.org
          // returns an access-denied image from this network. Esri World Street
          // Map is a free raster basemap with no key. Tile order is {z}/{y}/{x}.
          <TileLayer
            attribution='Tiles &copy; <a href="https://www.esri.com/">Esri</a> — Sources: Esri, HERE, Garmin, USGS, Intermap, INCREMENT P, NRCan, Esri Japan, METI, Esri China (Hong Kong), Esri Korea, Esri (Thailand), NGCC, &copy; OpenStreetMap contributors, and the GIS User Community'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
          />
        ) : null}

        {currentLayers.satellite ? (
          <TileLayer
            attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
        ) : null}

        <MapEvents onMapClick={handleMapClick} onLocationFound={setUserLocation} />

        {enableSearch ? <SearchControl onSearch={handleSearch} /> : null}

        {enableControls ? (
          <CustomControls onLocate={handleLocate} onToggleLayer={handleToggleLayer} layers={currentLayers} />
        ) : null}

        {enableClustering ? <MarkerClusterGroup>{markerNodes}</MarkerClusterGroup> : markerNodes}

        {userLocation ? (
          <Marker position={userLocation} icon={createCustomIcon("red", "medium")}>
            <Popup>Your current location</Popup>
          </Marker>
        ) : null}

        {searchResult ? (
          <Marker position={searchResult.latLng} icon={createCustomIcon("green", "large")}>
            <Popup>{searchResult.name}</Popup>
          </Marker>
        ) : null}

        {clickedLocation ? (
          <Marker position={clickedLocation} icon={createCustomIcon("orange", "small")}>
            <Popup>
              Lat: {clickedLocation.lat.toFixed(6)}
              <br />
              Lng: {clickedLocation.lng.toFixed(6)}
            </Popup>
          </Marker>
        ) : null}

        {polygons.map((polygon, index) => (
          <Polygon
            key={polygon.id || index}
            positions={polygon.positions}
            pathOptions={polygon.style || { color: "purple", weight: 2, fillOpacity: 0.3 }}
          >
            {polygon.popup ? <Popup>{polygon.popup}</Popup> : null}
          </Polygon>
        ))}

        {circles.map((circle, index) => (
          <Circle
            key={circle.id || index}
            center={circle.center}
            radius={circle.radius}
            pathOptions={circle.style || { color: "blue", weight: 2, fillOpacity: 0.2 }}
          >
            {circle.popup ? <Popup>{circle.popup}</Popup> : null}
          </Circle>
        ))}

        {polylines.map((polyline, index) => (
          <Polyline
            key={polyline.id || index}
            positions={polyline.positions}
            pathOptions={polyline.style || { color: "red", weight: 3 }}
          >
            {polyline.popup ? <Popup>{polyline.popup}</Popup> : null}
          </Polyline>
        ))}
      </MapContainer>
    </div>
  );
};

export default AdvancedMap;
