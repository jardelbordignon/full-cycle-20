import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  type NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('API');

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.enableCors({ origin: process.env.CORS_ORIGIN });

  await app
    .listen(process.env.PORT!, '0.0.0.0') // '0.0.0.0': Torna o servidor acessível de fora do container ou da máquina local.
    .then(async () =>
      logger.log(
        `🚀 running on: ${await app.getUrl()} - env: ${process.env.NODE_ENV}`,
      ),
    )
    .catch((error) => logger.error(`❌ Server starts error: ${error}`));
}
bootstrap();
