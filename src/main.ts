import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { ConfigService } from '@nestjs/config';
import { useContainer } from 'class-validator';
import { applyAppSettings } from './settings/apply-app-settings';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.use(cookieParser());
  applyAppSettings(app);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('port');

  const serverUrl = 'http://localhost:3000';
  // // get the swagger json file (if app is running in development mode)
  // if (process.env.NODE_ENV === 'development') {
  //   // write swagger ui files
  //   get(`${serverUrl}/swagger/swagger-ui-bundle.js`, function (response) {
  //     response.pipe(createWriteStream('swagger-static/swagger-ui-bundle.js'));
  //     console.log(
  //       `Swagger UI bundle file written to: '/swagger-static/swagger-ui-bundle.js'`,
  //     );
  //   });
  //
  //   get(`${serverUrl}/swagger/swagger-ui-init.js`, function (response) {
  //     response.pipe(createWriteStream('swagger-static/swagger-ui-init.js'));
  //     console.log(
  //       `Swagger UI init file written to: '/swagger-static/swagger-ui-init.js'`,
  //     );
  //   });
  //
  //   get(
  //     `${serverUrl}/swagger/swagger-ui-standalone-preset.js`,
  //     function (response) {
  //       response.pipe(
  //         createWriteStream('swagger-static/swagger-ui-standalone-preset.js'),
  //       );
  //       console.log(
  //         `Swagger UI standalone preset file written to: '/swagger-static/swagger-ui-standalone-preset.js'`,
  //       );
  //     },
  //   );
  //
  //   get(`${serverUrl}/swagger/swagger-ui.css`, function (response) {
  //     response.pipe(createWriteStream('swagger-static/swagger-ui.css'));
  //     console.log(
  //       `Swagger UI css file written to: '/swagger-static/swagger-ui.css'`,
  //     );
  //   });
  // }
  app.enableCors();
  await app.init();
  await app.listen(port, () => console.log(`Server running on port ${port}`));
}

bootstrap();
