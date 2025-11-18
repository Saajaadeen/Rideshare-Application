import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export default function MapDisplay({ user, station }: any) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapRef.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution: "© OpenStreetMap contributors",
          },
        },
        layers: [
          {
            id: "osm",
            type: "raster",
            source: "osm",
          },
        ],
      },
      center: [parseFloat(user.base.long), parseFloat(user.base.lat)],
      zoom: 14,
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [user.base.long, user.base.lat]);

  // Add markers for stations
  useEffect(() => {
    if (!mapInstanceRef.current || !station) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add new markers
    station.forEach((loc: any) => {
      const popup = new maplibregl.Popup({ offset: 25 }).setHTML(
        `<div class="p-2">
          <h3 class="font-bold">${loc.name}</h3>
          <p class="text-sm">${loc.description || ""}</p>
        </div>`
      );

      const marker = new maplibregl.Marker({ color: "#ef4444" })
        .setLngLat([parseFloat(loc.longitude), parseFloat(loc.latitude)])
        .setPopup(popup)
        .addTo(mapInstanceRef.current!);

      // Add click handler for selection
      marker.getElement().addEventListener("click", () => {
        console.log("Selected station:", loc);
        // You can add your selection logic here
        // For example, call a callback function or update state
      });

      markersRef.current.push(marker);
    });

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
    };
  }, [station]);

  return <div ref={mapRef} className="relative w-screen h-screen" />;
}