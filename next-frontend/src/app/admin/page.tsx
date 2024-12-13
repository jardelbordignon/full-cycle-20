"use client";

import { useRef } from "react";
import { useMap } from "@/hooks/use-map";

export default function Admin() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  useMap(mapContainerRef);

  return <div className="w-full h-full min-h-screen" ref={mapContainerRef} />;
}
