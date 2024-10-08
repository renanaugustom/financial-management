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
  CREDIT_CARD_DOESNT_BELONG_TO_ACCOUNT: new APIError(
    HttpStatus.CONFLICT,
    '0003',
    'Credit card doesn`t belong to user',
  ),
  CREDIT_CARD_NOT_FOUND: new APIError(
    HttpStatus.NOT_FOUND,
    '0004',
    'Credit card not found',
  ),
  USER_NOT_AUTHORIZED: new APIError(
    HttpStatus.UNAUTHORIZED,
    '0005',
    'Unauthorized',
  ),
  FINANCIAL_ACCOUNT_DOESNT_BELONG_TO_USER: new APIError(
    HttpStatus.CONFLICT,
    '0006',
    'Financial account doesn`t belong to user',
  ),
  USER_NOT_EXISTS: new APIError(
    HttpStatus.NOT_FOUND,
    '0007',
    'User doesn`t exists',
  ),
  CATEGORY_NOT_EXISTS: new APIError(
    HttpStatus.NOT_FOUND,
    '0008',
    'Category doesn`t exists',
  ),
  FINANCIAL_ACCOUNT_NOT_EXISTS: new APIError(
    HttpStatus.NOT_FOUND,
    '0009',
    'Financial account doesn`t exists',
  ),
};
