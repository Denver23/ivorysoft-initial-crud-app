import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ResponseBuilderService } from '../responseBuilder/responseBuilder.service';
import { errorsList, IDefaultError } from '../config/errorsList';
import { ValidationError } from 'class-validator';
import { MongoError } from 'mongodb';

export class ProjectError extends Error {
  code: number;
  error: IDefaultError;
  constructor(code: number, descriptionMessage?: string) {
    super();
    this.code = code;
    if (errorsList[`error${code}`]) {
      const errorObject = errorsList[`error${code}`];
      this.error = errorObject;
      this.error.message = descriptionMessage
        ? `${errorObject.message} ${descriptionMessage}`
        : errorObject.message;
    } else {
      this.error = errorsList.error1000;
    }
  }
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private logger: Logger;

  constructor(readonly responseBuilderService: ResponseBuilderService) {
    this.logger = new Logger('AllExceptions');
  }

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    this.logger.error(
      `${request.method} ${request.path} Error: ${JSON.stringify(
        exception.message,
      )}`,
    );

    let status;
    let responseBuilder;
    switch (true) {
      case exception.name === 'CastError': {
        status = errorsList.error1016.status;
        responseBuilder = this.responseBuilderService.sendError(
          errorsList.error1016.message,
          errorsList.error1016.code,
        );
        break;
      }
      case exception instanceof MongoError: {
        if (exception.code === 11000) {
          status = errorsList.error1013.status;
          responseBuilder = this.responseBuilderService.sendError(
            errorsList.error1013.message,
            errorsList.error1013.code,
          );
        } else {
          status = HttpStatus.INTERNAL_SERVER_ERROR;
          responseBuilder =
            this.responseBuilderService.buildErrorResponseFromError(
              exception.message,
            );
        }
        break;
      }
      case exception instanceof HttpException: {
        status = exception.getStatus();
        const message = exception?.response?.message
          ? exception.response.message
          : exception.message;
        responseBuilder =
          this.responseBuilderService.buildErrorResponseFromError(message);
        break;
      }
      case exception instanceof ProjectError: {
        const { error } = exception;
        status = error.status;
        responseBuilder = this.responseBuilderService.sendError(
          error.message,
          error.code,
        );
        break;
      }
      case exception instanceof ValidationError: {
        status = HttpStatus.BAD_REQUEST;

        const constraintsValues = Object.values(exception.constraints);
        const message = constraintsValues.join(', ');

        responseBuilder =
          this.responseBuilderService.buildErrorResponseFromError(message);
        break;
      }
      default: {
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        responseBuilder =
          this.responseBuilderService.buildErrorResponseFromError(
            exception.message,
          );
      }
    }

    response.status(status).json(responseBuilder);
  }
}
