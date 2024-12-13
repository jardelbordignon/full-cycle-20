/**
 * Obs. Necessário Google Maps JavaScript API ativada
 */

import { Loader } from "@googlemaps/js-api-loader";
import { useEffect, useState } from "react";
import { Map } from "../utils/map";
import { getCurrentPosition } from "./geolocation";

export function useMap(containerRef?: React.RefObject<HTMLDivElement | null>) {
  const [map, setMap] = useState<Map>();

  async function loadMap(
    currentRef: React.RefObject<HTMLDivElement>["current"]
  ) {
    const loader = new Loader({
      //apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
      apiKey: "AIzaSyDUoJW-cNp4G20v23lO-uJu4jDBdtGnfjg",
      libraries: ["routes", "geometry", "marker"],
    });
    const [, , , position] = await Promise.all([
      loader.importLibrary("routes"),
      loader.importLibrary("geometry"),
      loader.importLibrary("marker"),
      getCurrentPosition({ enableHighAccuracy: true }),
    ]);
    const map = new Map(currentRef, {
      mapId: "8e0a97af9386fef", // theme - https://console.cloud.google.com/google/maps-apis/studio/styles?project=your-project
      zoom: 15,
      center: position,
    });
    setMap(map);
  }

  useEffect(() => {
    if (containerRef?.current) loadMap(containerRef.current);
  }, [containerRef]);

  return map;
}
