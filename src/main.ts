import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { ConfigService } from '@nestjs/config';
import { useContainer } from 'class-validator';
import { applyAppSettings } from './settings/apply-app-settings';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.use(cookieParser());
  applyAppSettings(app);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('port');

  /**
   * Swagger Configuration
   */
  const config = new DocumentBuilder()
    .setTitle('My NestJs Application API')
    .setDescription('Use the  base API URL as http://localhost:3000')
    .addServer('http://localhost:3000')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors();
  await app.init();
  await app.listen(port, () => console.log(`Server running on port ${port}`));
}

bootstrap();
