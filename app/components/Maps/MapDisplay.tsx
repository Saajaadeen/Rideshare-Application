import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";

export default function MapDisplay({ user, station }: any) {
  console.log("User Info: ", user);
  console.log("Station Info: ", station);
  const mapRef = useRef<HTMLDivElement | null>(null);

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
      center: [parseFloat(user.base.lat), parseFloat(user.base.long)],
      zoom: 14,
    });

    return () => map.remove();
  }, [user.base.long, user.base.lat]);

  return <div ref={mapRef} className="relative w-screen h-screen" />;
}
