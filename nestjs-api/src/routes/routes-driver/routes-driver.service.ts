import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

type Props = {
  route_id: string;
  lat: number;
  lng: number;
};

@Injectable()
export class RoutesDriverService {
  constructor(private prismaService: PrismaService) {}

  async processRoute({ lat, lng, route_id }: Props) {
    const location = { lat, lng };

    return this.prismaService.routeDriver.upsert({
      include: {
        route: true, // eager loading
      },
      create: {
        route_id,
        points: {
          set: { location },
        },
      },
      update: {
        points: {
          push: { location },
        },
      },
      where: { route_id },
    });
  }
}
