import { mock } from 'jest-mock-extended';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

import { AuthService } from '@src/auth/auth.service';
import { User } from '@src/user/user.entity';
import { faker } from '@faker-js/faker';
import { UtilsService } from '@src/common/utils.service';
import { CATALOG_ERRORS } from '@src/exceptions/catalog-errors';
import { Role } from '@src/auth/dtos/role.enum';

describe('AuthService', () => {
  let authService: AuthService;
  let userRepositoryMock = mock<Repository<User>>();
  let jwtServiceMock = mock<JwtService>();

  const emailProvided = faker.internet.email();
  const passwordProvided = faker.internet.password();

  beforeEach(async () => {
    authService = new AuthService(jwtServiceMock, userRepositoryMock);
  });

  describe('signIn', () => {
    it('should sign in a user', async () => {
      // ARRANGE
      let utilsService = new UtilsService();
      let password = await utilsService.hashString(passwordProvided);

      const user: User = {
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password,
        createdAt: new Date(),
        updatedAt: new Date(),
        isAdmin: false,
        accounts: [],
      };

      userRepositoryMock.findOneBy.mockResolvedValueOnce(user);
      jwtServiceMock.signAsync.mockResolvedValueOnce('token');

      // ACT
      const result = await authService.signIn(emailProvided, passwordProvided);

      // ASSERT
      expect(jwtServiceMock.signAsync).toHaveBeenCalled();
      expect(userRepositoryMock.findOneBy).toHaveBeenCalledWith({
        email: emailProvided,
      });
      expect(result).toEqual({ access_token: 'token' });
    });

    it('should throw an error when the user is not found', async () => {
      // ARRANGE
      let result;
      let errorExpected = CATALOG_ERRORS.USER_NOT_AUTHORIZED;

      userRepositoryMock.findOneBy.mockResolvedValueOnce(undefined);

      // ACT
      try {
        await authService.signIn(emailProvided, passwordProvided);
      } catch (error) {
        result = error;
      }

      // ASSERT
      expect(jwtServiceMock.signAsync).not.toHaveBeenCalled();
      expect(result).toEqual(errorExpected);
      expect(userRepositoryMock.findOneBy).toHaveBeenCalledWith({
        email: emailProvided,
      });
    });

    it('should throw user not authorized when the password is incorrect', async () => {
      // ARRANGE
      let result;
      let errorExpected = CATALOG_ERRORS.USER_NOT_AUTHORIZED;

      let utilsService = new UtilsService();
      let password = await utilsService.hashString(passwordProvided);

      const user: User = {
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password,
        createdAt: new Date(),
        updatedAt: new Date(),
        isAdmin: false,
        accounts: [],
      };

      userRepositoryMock.findOneBy.mockResolvedValueOnce(user);

      // ACT
      try {
        await authService.signIn(emailProvided, 'wrong-password');
      } catch (error) {
        result = error;
      }

      // ASSERT
      expect(jwtServiceMock.signAsync).not.toHaveBeenCalled();
      expect(result).toEqual(errorExpected);
      expect(userRepositoryMock.findOneBy).toHaveBeenCalledWith({
        email: emailProvided,
      });
    });
  });

  describe('_buildRoles', () => {
    it('should build roles for a user', () => {
      // ARRANGE
      const user: User = {
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        createdAt: new Date(),
        updatedAt: new Date(),
        isAdmin: false,
        accounts: [],
      };

      // ACT
      const result = authService['_buildRoles'](user);

      // ASSERT
      expect(result).toEqual([Role.User]);
    });

    it('should build roles for an admin user', () => {
      // ARRANGE
      const user: User = {
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        createdAt: new Date(),
        updatedAt: new Date(),
        isAdmin: true,
        accounts: [],
      };

      // ACT
      const result = authService['_buildRoles'](user);

      // ASSERT
      expect(result).toEqual([Role.Admin]);
    });
  });
});
