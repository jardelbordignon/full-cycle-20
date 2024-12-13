import { DirectionsResponseData } from "@googlemaps/google-maps-services-js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DirectionsData = DirectionsResponseData & { request: any };

export type RouteModel = {
  id: string;
  name: string;
  origin: { name: string; location: { lat: number; lng: number } };
  destination: { name: string; location: { lat: number; lng: number } };
  distance: number;
  duration: number;
  directions: DirectionsData;
  created_at: Date;
  updated_at: Date;
};