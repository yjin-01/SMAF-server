import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';
import 'dotenv/config';
import * as dotenv from 'dotenv';
import { graphqlUploadExpress } from 'graphql-upload';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
process.env.IMPORTCORS;
//import * as cors from 'cors';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(graphqlUploadExpress());
  //app.useStaticAssets(join(__dirname, '..', 'static'));
  process.env.USECORS;
  //app.use(cors());
  app.enableCors({
    origin: true, //
    credentials: true,
  });
  await app.listen(3000);
}
bootstrap();
