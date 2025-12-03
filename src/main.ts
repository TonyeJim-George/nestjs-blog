import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { appCreate } from './app.create';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //Add all middlewares and configurations
  appCreate(app);

  await app.listen(3000);
}
bootstrap();
