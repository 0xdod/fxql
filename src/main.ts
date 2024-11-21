import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import * as dotenv from 'dotenv';
import * as morgan from 'morgan';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppModule } from './app.module';
import { configureSwagger } from './common/config/swagger';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(logger);

  const environment = process.env.NODE_ENV;

  const port = process.env.PORT || 8000;

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.enableVersioning({ type: VersioningType.URI });

  if (environment !== 'production') {
    app.use(morgan('combined'));
  }

  configureSwagger(app);

  await app.listen(port);
  logger.log(`***application listening on port ${port}***`);
}
bootstrap();
