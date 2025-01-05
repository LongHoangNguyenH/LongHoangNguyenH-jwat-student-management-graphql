import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: errors => {
        const messages = errors.reduce(
          (messages: string, error) => messages.concat(' ' + error.constraints[Object.keys(error.constraints)[0]]),
          '',
        );
        return new BadRequestException(messages);
      },
      stopAtFirstError: true,
    }),
  );
  app.enableCors({ credentials: true, origin: process.env.CLIENT_URI });
  await app.listen(process.env.APP_PORT ?? 3000);
}
bootstrap();
