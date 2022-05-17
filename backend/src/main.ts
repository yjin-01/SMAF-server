import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';
import 'dotenv/config';
import * as cors from 'cors';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  // app.use(cors());
  app.enableCors({
    origin: 'http://localhost:3000', //
    credentials: true,
  });
  await app.listen(3000);
}
bootstrap();
