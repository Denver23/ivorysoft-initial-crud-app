import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validateOrReject } from 'class-validator';

export const RequestHeader = createParamDecorator(
  async (value: any, ctx: ExecutionContext) => {
    try {
      const headers = ctx.switchToHttp().getRequest().headers;
      const dto = plainToClass(value, headers, {
        excludeExtraneousValues: false,
      });
      await validateOrReject(dto, { stopAtFirstError: true });
      return dto;
    } catch (e) {
      if (e instanceof Array) {
        throw e[0];
      } else {
        throw e;
      }
    }
  },
);
