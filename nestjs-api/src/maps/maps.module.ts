import { Module } from '@nestjs/common';
import { Client as GoogleMapsClient } from '@googlemaps/google-maps-services-js';

import { DirectionsController } from './directions/directions.controller';
import { DirectionsService } from './directions/directions.service';
import { PlacesController } from './places/places.controller';
import { PlacesService } from './places/places.service';

@Module({
  controllers: [DirectionsController, PlacesController],
  providers: [
    {
      provide: GoogleMapsClient,
      useValue: new GoogleMapsClient(),
    },
    DirectionsService,
    PlacesService,
  ],
  exports: [DirectionsService],
})
export class MapsModule {}
