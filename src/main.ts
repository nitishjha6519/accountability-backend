import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import { Request, Response, NextFunction } from 'express';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const express = require('express');

const server = express();

async function bootstrap(): Promise<ReturnType<typeof express>> {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

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

  await app.init();

  if (process.env.VERCEL !== '1') {
    await app.listen(process.env.PORT ?? 3002);
  }

  return server;
}

// Vercel serverless handler
let cachedApp: ReturnType<typeof express> | null = null;

export default async function handler(req: Request, res: Response) {
  if (!cachedApp) {
    cachedApp = await bootstrap();
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  cachedApp(req, res);
}

// Local dev: run as normal server
if (process.env.VERCEL !== '1') {
  bootstrap();
}
