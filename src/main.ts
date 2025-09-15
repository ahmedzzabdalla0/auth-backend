import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { ValidationException } from 'exceptions/validation.exception';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  try {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(
      new ValidationPipe({
        exceptionFactory: (validationErrors: ValidationError[] = []) => {
          const errors = validationErrors.map((error) => ({
            field: error.property,
            messages: Object.values(error.constraints || {}),
          }));
          return new ValidationException(errors);
        },
        transform: true,
        whitelist: true,
      }),
    );

    // Swagger configuration
    const config = new DocumentBuilder()
      .setTitle('Auth API')
      .setDescription('The Auth API description')
      .setVersion('1.0')
      .addTag('auth')
      .addBearerAuth()
      .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, documentFactory);

    // Security middleware
    app.use(cookieParser());
    app.use(
      helmet({
        crossOriginResourcePolicy: { policy: 'cross-origin' },
      }),
    );

    // CORS configuration
    app.enableCors({
      origin:
        process.env.FRONTEND_BASE_URL?.split(',') || 'http://localhost:3000',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    });

    const port = process.env.PORT || 3000;
    await app.listen(port);

    logger.log(`Application is running on port ${port}`);
    logger.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  } catch (error) {
    logger.error('Error starting server:', error);
    process.exit(1);
  }
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
