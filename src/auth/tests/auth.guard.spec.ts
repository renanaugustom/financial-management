import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';
import { mock } from 'jest-mock-extended';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

import { AuthGuard } from '../auth.guard';
import { CATALOG_ERRORS } from '@src/exceptions/catalog-errors';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let jwtServiceMock = mock<JwtService>();
  let reflectorMock = mock<Reflector>();

  beforeEach(async () => {
    authGuard = new AuthGuard(jwtServiceMock, reflectorMock);
  });

  describe('canActivate', () => {
    it('should return true if the route is public', async () => {
      // ARRANGE
      const context: ExecutionContext = {
        switchToHttp: () => ({
          getRequest: () => ({
            headers: {},
          }),
        }),
        getHandler: () => {},
        getClass: () => {},
      } as ExecutionContext;

      reflectorMock.getAllAndOverride.mockReturnValue(true);

      // ACT
      const result = await authGuard.canActivate(context);

      // ASSERT
      expect(result).toBe(true);
    });

    it('should return true if the token is valid', async () => {
      // ARRANGE
      const context: ExecutionContext = {
        switchToHttp: () => ({
          getRequest: () => ({
            headers: {
              authorization: 'Bearer valid_token',
            },
          }),
        }),
        getHandler: () => {},
        getClass: () => {},
      } as ExecutionContext;

      reflectorMock.getAllAndOverride.mockReturnValue(false);
      jwtServiceMock.verifyAsync.mockResolvedValue({});

      // ACT
      const result = await authGuard.canActivate(context);

      // ASSERT
      expect(result).toBe(true);
    });

    it('should throw user not authorized if the token is missing', async () => {
      // ARRANGE
      const context: ExecutionContext = {
        switchToHttp: () => ({
          getRequest: () => ({
            headers: {},
          }),
        }),
        getHandler: () => {},
        getClass: () => {},
      } as ExecutionContext;

      reflectorMock.getAllAndOverride.mockReturnValue(false);

      // ACT
      let result;

      try {
        await authGuard.canActivate(context);
      } catch (error) {
        result = error;
      }

      // ASSERT
      expect(result).toEqual(CATALOG_ERRORS.USER_NOT_AUTHORIZED);
    });

    it('should throw user not authorized if the token is invalid', async () => {
      // ARRANGE
      const context: ExecutionContext = {
        switchToHttp: () => ({
          getRequest: () => ({
            headers: {
              authorization: 'Bearer invalid_token',
            },
          }),
        }),
        getHandler: () => {},
        getClass: () => {},
      } as ExecutionContext;

      reflectorMock.getAllAndOverride.mockReturnValue(false);
      jwtServiceMock.verifyAsync.mockRejectedValue(new Error('any error'));

      // ACT
      let result;

      try {
        await authGuard.canActivate(context);
      } catch (error) {
        result = error;
      }

      // ASSERT
      expect(result).toEqual(CATALOG_ERRORS.USER_NOT_AUTHORIZED);
    });
  });

  describe('extractTokenFromHeader', () => {
    it('should extract the token from the authorization header', () => {
      // ARRANGE
      const request: any = {
        headers: {
          authorization: 'Bearer valid_token',
        },
      };

      // ACT
      const result = authGuard['extractTokenFromHeader'](request);

      // ASSERT
      expect(result).toEqual('valid_token');
    });

    it('should return undefined if the authorization header is missing', () => {
      // ARRANGE
      const request: any = {
        headers: {},
      };

      // ACT
      const result = authGuard['extractTokenFromHeader'](request);

      // ASSERT
      expect(result).toBeUndefined();
    });
  });
});
