"use client";

import { useEffect, useRef } from "react";
import { useMap } from "@/hooks/use-map";
import { socket } from "@/utils/socket-io";

type DriverMapProps = {
  routeId: string | null;
};

export function DriverMap({ routeId }: DriverMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const map = useMap(mapContainerRef);

  useEffect(() => {
    if (!map || !routeId) return;

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    socket.disconnected ? socket.connect() : socket.offAny();

    socket.on(`server:new-points/${routeId}:list`, (data) => {
      console.log(data);
    });

    return () => {
      socket.disconnect();
    };
  }, [routeId, map]);

  return <div className="w-2/3 h-full min-h-screen" ref={mapContainerRef} />;
}
