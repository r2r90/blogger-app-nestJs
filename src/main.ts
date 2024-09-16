import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';
import { useContainer } from 'class-validator';
import { applyAppSettings } from './settings/apply-app-settings';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  applyAppSettings(app);

  // app.setGlobalPrefix('/api');
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     stopAtFirstError: true,
  //     exceptionFactory: (errors) => {
  //       const responseErrors = [];
  //
  //       errors.forEach((error) => {
  //         // responseErrors.push({field: error.property});
  //         const constraintsKeys = Object.keys(error.constraints);
  //         constraintsKeys.forEach((ckey) => {
  //           responseErrors.push({
  //             message: error.constraints[ckey],
  //             field: error.property,
  //           });
  //         });
  //       });
  //
  //       throw new BadRequestException(responseErrors);
  //     },
  //   }),
  // );
  // app.useGlobalFilters(new HttpExceptionFilter());
  const configService = app.get(ConfigService);
  const port = configService.get<number>('port');
  app.enableCors();
  await app.listen(port, () => console.log(`Server running on port ${port}`));
}

bootstrap();
