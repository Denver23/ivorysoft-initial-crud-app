import { HttpStatus } from '@nestjs/common';

export interface IDefaultError {
  message: string;
  code: number;
  status: HttpStatus;
}

export const errorsList: Record<string, IDefaultError> = {
  error1000: {
    message: 'The next error was caught: ',
    code: 1000,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  },
  error1001: {
    message: 'Bad Request',
    code: 1001,
    status: HttpStatus.BAD_REQUEST,
  },
  error1002: {
    message: 'Forbbiden',
    code: 1002,
    status: HttpStatus.FORBIDDEN,
  },
  error1003: {
    message: 'Unauthorized',
    code: 1003,
    status: HttpStatus.UNAUTHORIZED,
  },
  error1004: {
    message: 'Not found',
    code: 1004,
    status: HttpStatus.NOT_FOUND,
  },
  error1005: {
    message: 'Conflict',
    code: 1005,
    status: HttpStatus.CONFLICT,
  },
  error1006: {
    message: 'Internal Server Error',
    code: 1006,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  },
  error1008: {
    status: HttpStatus.NOT_FOUND,
    message: 'User not found',
    code: 1008,
  },
  error1012: {
    status: HttpStatus.BAD_REQUEST,
    message: 'UserId is required',
    code: 1012,
  },
  error1013: {
    status: HttpStatus.BAD_REQUEST,
    message: 'User with this email already exists',
    code: 1013,
  },
  error1014: {
    status: HttpStatus.NOT_FOUND,
    message: 'Port Not Found',
    code: 1014,
  },
  error1015: {
    status: HttpStatus.NOT_FOUND,
    message: 'Vessel Not Found',
    code: 1015,
  },
  error1016: {
    status: HttpStatus.BAD_REQUEST,
    message: 'Cast to ObjectId failed',
    code: 1016,
  },
};
