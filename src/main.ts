import { NestFactory } from '@nestjs/core';

import { getExecutablePath } from 'aws-lambda-libreoffice';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);

  process.env.LIBREOFFICE_BINARY_PATH = await getExecutablePath();
}
bootstrap();
