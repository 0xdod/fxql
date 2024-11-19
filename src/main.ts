import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('bootstrap');

  const port = process.env.PORT || 3000;

  await app.listen(port);
  logger.log(`***application listening on port ${port}***`);
}
bootstrap();
