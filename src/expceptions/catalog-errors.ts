import { HttpStatus } from '@nestjs/common';
import { APIError } from './api-error';

export const CATALOG_ERRORS = {
  SERVER_ERROR: new APIError(
    HttpStatus.INTERNAL_SERVER_ERROR,
    '0001',
    `Internal server error`,
  ),
  DB_DUPLICATED_ERROR: (entity) => {
    return new APIError(
      HttpStatus.CONFLICT,
      '0002',
      `The ${entity} already exists`,
    );
  },
};
