import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { configuration } from './config/configuration';
import { UserModule } from './user/user.module';
import { ResponseBuilderModule } from './responseBuilder/responseBuilder.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { APP_FILTER } from '@nestjs/core';
import { PortsModule } from './ports/ports.module';
import { VesselsModule } from './vessels/vessels.module';
import { JsonBodyMiddleware } from './middlewares/json-body.middleware';
import { UrlencodedMiddleware } from './middlewares/urlencoded.middleware';

@Module({
  imports: [
    MongooseModule.forRoot(configuration.mongo.url),
    PortsModule,
    VesselsModule,
    AuthModule,
    UserModule,
    ResponseBuilderModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JsonBodyMiddleware).forRoutes('*').apply(UrlencodedMiddleware).forRoutes(AppController);
  }
}
