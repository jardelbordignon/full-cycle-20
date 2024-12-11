import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MapsModule } from './maps/maps.module';
import { RoutesModule } from './routes/routes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
    }),
    MapsModule,
    RoutesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
