import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Scope,
  Injectable,
} from '@nestjs/common';

import { Response } from 'express';

@Catch(HttpException)
@Injectable({ scope: Scope.REQUEST })
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any | HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;

    response.status(status).json({
      errorCode: exception.errorCode,
      message: exception.message,
    });
  }
}
