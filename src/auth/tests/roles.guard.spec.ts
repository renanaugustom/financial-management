import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import { mock } from 'jest-mock-extended';

import { RolesGuard } from '@src/auth/roles/roles.guard';
import { Role } from '@src/auth/dtos/role.enum';
import { CATALOG_ERRORS } from '@src/exceptions/catalog-errors';

describe('RolesGuard', () => {
  let rolesGuard: RolesGuard;
  let reflectorMock = mock<Reflector>();
  let mockExecutionContext: ExecutionContext;

  beforeEach(() => {
    rolesGuard = new RolesGuard(reflectorMock);

    mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: {
            roles: [Role.Admin],
          },
        }),
      }),
      getHandler: () => {},
      getClass: () => {},
    } as ExecutionContext;
  });

  describe('canActivate', () => {
    it('should return true if route doesn`t have any required role', () => {
      // ARRANGE
      reflectorMock.getAllAndOverride.mockReturnValue(undefined);

      // ACT
      const result = rolesGuard.canActivate(mockExecutionContext);

      // ASSERT
      expect(result).toBe(true);
    });

    it('should return true if user has the required role', () => {
      // ARRANGE
      const requiredRoles = [Role.Admin];
      reflectorMock.getAllAndOverride.mockReturnValue(requiredRoles);

      // ACT
      const result = rolesGuard.canActivate(mockExecutionContext);

      // ASSERT
      expect(result).toBe(true);
    });

    it('should throw user not authorized if user does not have the required role', () => {
      // ARRANGE
      const requiredRoles = [Role.User];
      reflectorMock.getAllAndOverride.mockReturnValue(requiredRoles);

      const expectedError = CATALOG_ERRORS.USER_NOT_AUTHORIZED;

      // ACT
      let result;

      try {
        rolesGuard.canActivate(mockExecutionContext);
      } catch (error) {
        result = error;
      }

      // ASSERT
      expect(result).toEqual(expectedError);
    });
  });
});
