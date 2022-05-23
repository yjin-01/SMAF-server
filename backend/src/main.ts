import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';
import 'dotenv/config';
import * as dotenv from 'dotenv';
import { graphqlUploadExpress } from 'graphql-upload';
process.env.IMPORTCORS;
// import * as cors from 'cors';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(graphqlUploadExpress());
  process.env.USECORS;
  // app.use(cors());
  app.enableCors({
    origin: 'http://localhost:3000', //
    credentials: true,
  });
  await app.listen(3000);
}
bootstrap();
