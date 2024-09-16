import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { useContainer } from 'class-validator';
import { AppModule } from '../app/app.module';
import { HttpExceptionFilter } from '../common/filters/custom.exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const applyAppSettings = (app: INestApplication) => {
  // Validator constraint
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // Use global pipes
  setAppPipes(app);

  // Use Global Exceptions Filters
  setAppExceptionsFilters(app);

  setSwagger(app);
};

const setAppPipes = (app: INestApplication) => {
  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      exceptionFactory: (errors) => {
        const responseErrors = [];

        errors.forEach((error) => {
          // responseErrors.push({field: error.property});
          const constraintsKeys = Object.keys(error.constraints);
          constraintsKeys.forEach((constraintKey) => {
            responseErrors.push({
              message: error.constraints[constraintKey],
              field: error.property,
            });
          });
        });

        throw new BadRequestException(responseErrors);
      },
    }),
  );
};

const setAppExceptionsFilters = (app: INestApplication) => {
  app.useGlobalFilters(new HttpExceptionFilter());
};

const setSwagger = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Blog app')
    .setDescription('The Blog APP API description')
    .setVersion('1.0')
    .addTag('blogs')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
};
