"use client";

import { useEffect, useRef } from "react";
import { useMap } from "@/hooks/use-map";
import { DirectionsData } from "@/utils/models";

export type NewRouteMapProps = {
  directionsData: DirectionsData;
};

export function NewRouteMap({ directionsData }: NewRouteMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const map = useMap(mapContainerRef);

  useEffect(() => {
    if (!map || !directionsData) {
      return;
    }

    const { start_location, end_location } = directionsData.routes[0].legs[0];
    map.removeAllRoutes();
    map.addRouteWithIcons({
      routeId: "1",
      carMarkerOptions: { position: start_location },
      startMarkerOptions: { position: start_location },
      endMarkerOptions: { position: end_location },
    });
  }, [map, directionsData]);

  return <div className="w-2/3 h-full min-h-screen" ref={mapContainerRef} />;
}
