"use server";

import { fetchGetDirections, fetchPostRoutes } from "@/services/requests";
import type { ActionState } from "../components/new-route-form";

export async function createRouteAction(
  state: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { originId, destinationId } = Object.fromEntries(formData);

  const directionsResponse = await fetchGetDirections(
    `${originId}`,
    `${destinationId}`
  );

  if (!directionsResponse.ok) {
    return { error: "Failed to fetch directions" };
  }

  const directionsData = await directionsResponse.json();
  const { start_address, end_address } = directionsData.routes[0].legs[0];
  const { origin, destination } = directionsData.request;

  const response = await fetchPostRoutes({
    name: `${start_address} - ${end_address}`,
    originId: origin.place_id.replace("place_id:", ""),
    destinationId: destination.place_id.replace("place_id:", ""),
  });

  if (!response.ok) {
    return { error: "Failed to create route" };
  }

  return { success: true };
}
