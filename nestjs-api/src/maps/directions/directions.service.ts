/**
 * Obs. Necessário Google Directions API ativada
 */

import { Injectable } from '@nestjs/common';
import {
  Client as GoogleMapsClient,
  TravelMode,
  type DirectionsRequest,
} from '@googlemaps/google-maps-services-js';

@Injectable()
export class DirectionsService {
  constructor(private googleMapsClient: GoogleMapsClient) {}

  async getDirections(originId: string, destinationId: string) {
    const params: DirectionsRequest['params'] = {
      origin: `place_id:${originId}`,
      destination: `place_id:${destinationId}`,
      mode: TravelMode.driving,
      key: process.env.GOOGLE_MAPS_API_KEY!,
    };

    const { data } = await this.googleMapsClient.directions({ params });

    const { start_location, end_location } = data.routes[0].legs[0];

    return {
      ...data,
      request: {
        origin: {
          place_id: params.origin,
          location: start_location,
        },
        destination: {
          place_id: params.destination,
          location: end_location,
        },
        mode: params.mode,
      },
    };
  }
}
