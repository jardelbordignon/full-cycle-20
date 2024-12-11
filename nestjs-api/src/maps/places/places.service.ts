/**
 * Obs. Necessário Google Places API ativada
 */

import { Injectable } from '@nestjs/common';
import {
  Client as GoogleMapsClient,
  PlaceInputType,
  type FindPlaceFromTextResponseData,
} from '@googlemaps/google-maps-services-js';

@Injectable()
export class PlacesService {
  constructor(private googleMapsClient: GoogleMapsClient) {}

  async findPlaces(input: string): Promise<FindPlaceFromTextResponseData> {
    const response = await this.googleMapsClient.findPlaceFromText({
      params: {
        input,
        inputtype: PlaceInputType.textQuery,
        fields: ['place_id', 'formatted_address', 'geometry', 'name'],
        key: process.env.GOOGLE_MAPS_API_KEY!,
      },
    });

    return response.data;
  }
}
