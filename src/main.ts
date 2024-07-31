import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('port');
  app.setGlobalPrefix('/api');
  app.enableCors();
  await app.listen(port, () => console.log(`Server running on port ${port}`));
}

bootstrap();
