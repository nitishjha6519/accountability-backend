import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Request, Response, NextFunction } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Log each incoming request URL
  app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`[Request] ${req.method} ${req.url}`);
    next();
  });

  // Enable CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3002);
}
bootstrap();
