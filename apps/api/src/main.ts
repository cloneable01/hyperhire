import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import * as express from 'express';
// import * as serverless from 'serverless-http';

// const app = express();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
  });

  await app.listen(8000);
}
bootstrap();
