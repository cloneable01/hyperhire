import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import * as express from 'express';
// import * as serverless from 'serverless-http';

// const app = express();

async function bootstrap() {
  const nestApp = await NestFactory.create(AppModule);

  nestApp.enableCors({
    origin: '*',
  });

  await nestApp.listen(8000);
}
bootstrap();
