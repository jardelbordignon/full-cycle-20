"use client";

import { useEffect, useRef } from "react";
import { useMap } from "@/hooks/use-map";
import { socket } from "@/utils/socket-io";

export type LatLng = google.maps.LatLngLiteral;

type DriverMapProps = {
  routeId?: string;
  startLocation?: LatLng;
  endLocation?: LatLng;
};

export function DriverMap(props: DriverMapProps) {
  const { routeId, startLocation, endLocation } = props;

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const map = useMap(mapContainerRef);

  useEffect(() => {
    if (!map || !routeId || !startLocation || !endLocation) return;

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    socket.disconnected ? socket.connect() : socket.offAny();

    socket.on("connect", () => {
      console.log("connected");
      socket.emit("client:new-points", { routeId });
    });

    socket.on(`server:new-points/${routeId}:list`, (position: LatLng) => {
      // console.log(data);
      if (map.hasRoute(routeId)) {
        map.moveCar(routeId, position)
      } else {
        map.addRouteWithIcons({
          routeId,
          carMarkerOptions: {
            position: startLocation,
          },
          startMarkerOptions: {
            position: startLocation,
          },
          endMarkerOptions: {
            position: endLocation,
          },
        });
      }
    })

    return () => {
      socket.disconnect();
    }
  }, [routeId, startLocation, endLocation, map]);

  return <div className="w-2/3 h-full min-h-screen" ref={mapContainerRef} />;
}
