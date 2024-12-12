export function newRouteFunctions() {
  async function searchDirections(origin: string, destination: string) {
    const apiHost = "http://localhost:4000";

    const [originResponse, destinationResponse] = await Promise.all([
      fetch(`${apiHost}/places?text=${origin}`),
      fetch(`${apiHost}/places?text=${destination}`),
    ]);

    if (!originResponse.ok) throw new Error("Failed to fetch origin");
    if (!destinationResponse.ok) throw new Error("Failed to fetch destination");

    const [originData, destinationData] = await Promise.all([
      originResponse.json(),
      destinationResponse.json(),
    ]);

    const placeOriginId = originData.candidates[0].place_id;
    const placeDestinationId = destinationData.candidates[0].place_id;

    const directionsResponse = await fetch(
      `${apiHost}/directions?originId=${placeOriginId}&destinationId=${placeDestinationId}`
    );

    if (!directionsResponse.ok) throw new Error("Failed to fetch directions");

    const directionsData = await directionsResponse.json();

    return {
      directionsData,
      placeOriginId,
      placeDestinationId,
    };
  }

  return { searchDirections };
}
