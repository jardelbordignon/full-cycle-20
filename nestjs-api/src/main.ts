import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;
  const logger = new Logger('API');

  await app
    .listen(port)
    .then(async () => logger.log(`🚀 running on: ${await app.getUrl()}`))
    .catch((error) => logger.error(`❌ Server starts error: ${error}`));
}
bootstrap();
