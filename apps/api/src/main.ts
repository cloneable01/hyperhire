import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://hyperhire-snowy.vercel.app',
      'https://hyperhire-git-main-cloneable01s-projects.vercel.app',
      'https://hyperhire-api-dun.vercel.app',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: false,
    allowedHeaders: ['Content-Type', 'Accept'],
  });

  await app.listen(process.env.PORT || 8000);
}
bootstrap();
