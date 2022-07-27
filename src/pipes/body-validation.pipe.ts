import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { ProjectError } from '../filters/all-exceptions.filter';

@Injectable()
export class BodyValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    const obj = plainToClass(metadata.metatype, value);
    const errors = await validate(obj, {
      skipMissingProperties: false,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    });

    if (errors.length) {
      const messages = errors.map((err) => {
        return ` ${Object.values(err.constraints).join(', ')}`;
      });
      throw new ProjectError(1001, messages.join(';'));
    }
    return value;
  }
}
