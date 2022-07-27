import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import { configuration } from './config/configuration';
import { BodyValidationPipe } from './pipes/body-validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new BodyValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Project Example API')
    .setDescription('The project example document API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api-docs', app, document);

  await app.listen(configuration.server.port);

  Logger.log(`Server was started on http://${configuration.server.host}:${configuration.server.port}`, 'APP');
  Logger.log(`Server was started on http://${configuration.server.host}:${configuration.server.port}/api-docs`, 'APP');
}

bootstrap();
