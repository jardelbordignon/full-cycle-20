import { fetchGetDirections, fetchGetPlaces } from "@/services/requests";

export async function searchDirections(origin: string, destination: string) {
  const [originResponse, destinationResponse] = await Promise.all([
    fetchGetPlaces(origin),
    fetchGetPlaces(destination),
  ]);

  if (!originResponse.ok) throw new Error("Failed to fetch origin");
  if (!destinationResponse.ok) throw new Error("Failed to fetch destination");

  const [originData, destinationData] = await Promise.all([
    originResponse.json(),
    destinationResponse.json(),
  ]);

  const placeOriginId = originData.candidates[0].place_id;
  const placeDestinationId = destinationData.candidates[0].place_id;

  const directionsResponse = await fetchGetDirections(
    placeOriginId,
    placeDestinationId
  );

  if (!directionsResponse.ok) throw new Error("Failed to fetch directions");

  const directionsData = await directionsResponse.json();

  return {
    directionsData,
    placeOriginId,
    placeDestinationId,
  };
}
