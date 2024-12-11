import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MapsModule } from './maps/maps.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
    }),
    MapsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
