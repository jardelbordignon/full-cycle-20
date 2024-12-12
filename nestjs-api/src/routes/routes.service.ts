import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { DirectionsService } from 'src/maps/directions/directions.service';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';

@Injectable()
export class RoutesService {
  constructor(
    private prismaService: PrismaService,
    private directionsService: DirectionsService,
  ) {}

  async create({ name, originId, destinationId }: CreateRouteDto) {
    const { available_travel_modes, geocoded_waypoints, routes, request } =
      await this.directionsService.getDirections(originId, destinationId);

    const leg = routes[0].legs[0];

    return this.prismaService.route.create({
      data: {
        name,
        origin: {
          name: leg.start_address,
          location: leg.start_location,
        },
        destination: {
          name: leg.end_address,
          location: leg.end_location,
        },
        directions: JSON.parse(
          JSON.stringify({
            available_travel_modes,
            geocoded_waypoints,
            routes,
            request,
          }),
        ),
        distance: leg.distance.value,
        duration: leg.duration.value,
      },
    });
  }

  findAll() {
    return this.prismaService.route.findMany();
  }

  findOne(id: string) {
    return this.prismaService.route.findFirstOrThrow({
      where: { id },
    });
  }

  async update(id: string, updateRouteDto: UpdateRouteDto) {
    const { name, originId, destinationId } = updateRouteDto;

    const data = {};

    if (name) {
      Object.assign(data, { name });
    }

    if (originId && destinationId) {
      const { available_travel_modes, geocoded_waypoints, routes, request } =
        await this.directionsService.getDirections(originId, destinationId);

      const leg = routes[0].legs[0];

      Object.assign(data, {
        origin: {
          name: leg.start_address,
          location: leg.start_location,
        },
        destination: {
          name: leg.end_address,
          location: leg.end_location,
        },
        directions: JSON.parse(
          JSON.stringify({
            available_travel_modes,
            geocoded_waypoints,
            routes,
            request,
          }),
        ),
        distance: leg.distance.value,
        duration: leg.duration.value,
      });
    }

    return this.prismaService.route.update({ data, where: { id } });
  }

  remove(id: string) {
    return this.prismaService.route.delete({ where: { id } });
  }
}
