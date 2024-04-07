import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Scope,
  Injectable,
} from '@nestjs/common';

import { Response } from 'express';
import { CATALOG_ERRORS } from './catalog-errors';
import { APIError } from './api-error';

@Catch(HttpException)
@Injectable({ scope: Scope.REQUEST })
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any | HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const customError =
      exception instanceof APIError ? exception : CATALOG_ERRORS.SERVER_ERROR;

    // TODO: Log the error

    response.status(customError.getStatus()).json({
      errorCode: customError.errorCode,
      message: customError.message,
    });
  }
}
