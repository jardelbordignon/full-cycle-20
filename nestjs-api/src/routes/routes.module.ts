import { Module } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { RoutesController } from './routes.controller';
import { RoutesDriverService } from './routes-driver/routes-driver.service';
import { MapsModule } from 'src/maps/maps.module';
import { RoutesDriverGateway } from './routes-driver/routes-driver.gateway';

@Module({
  imports: [MapsModule],
  controllers: [RoutesController],
  providers: [RoutesService, RoutesDriverService, RoutesDriverGateway],
})
export class RoutesModule {}
