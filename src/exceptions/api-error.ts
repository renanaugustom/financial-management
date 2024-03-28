import { HttpException } from '@nestjs/common';

export interface IAPIError {
  httpStatusCode: number;
  errorCode: string;
  message: string;
}

export class APIError extends HttpException implements IAPIError {
  constructor(
    public httpStatusCode: number,
    public errorCode: string,
    public message: string,
  ) {
    super(message, httpStatusCode);
  }
}
