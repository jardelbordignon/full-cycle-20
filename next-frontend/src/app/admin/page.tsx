"use client";

import { useEffect, useRef } from "react";
import { useMap } from "@/hooks/use-map";
import { socket } from "@/utils/socket-io";
import { fetchGetRoute } from "@/services/requests";

type Payload = {
  routeId: string 
  lat: number 
  lng: number 
}

export default function Admin() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const map = useMap(mapContainerRef);

  useEffect(() => {
    if (!map) return;

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    socket.disconnected ? socket.connect() : socket.offAny();

    socket.on("server:new-points:list", async (data: Payload) => {
      const { routeId, lat, lng } = data;

      if (map.hasRoute(routeId)) {
        map.moveCar(routeId, { lat, lng });
      } else {
        const getRouteResponse = await fetchGetRoute(routeId)
        const route = await getRouteResponse.json()
        const { start_location, end_location } = route.directions.routes[0].legs[0];
        
        map.addRouteWithIcons({
          routeId,
          carMarkerOptions: {
            position: start_location,
          },
          startMarkerOptions: {
            position: start_location,
          },
          endMarkerOptions: {
            position: end_location,
          },
        });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [map]);

  return <div className="w-full h-full min-h-screen" ref={mapContainerRef} />;
}
