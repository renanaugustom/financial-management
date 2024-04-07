import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';

import { UserService } from '@src/user/user.service';
import { UserCreateDTO } from '@src/user/dtos/user-create.dto';
import { User } from '@src/user/user.entity';
import { any, mock } from 'jest-mock-extended';
import { faker } from '@faker-js/faker';
import { plainToInstance } from 'class-transformer';
import { CATALOG_ERRORS } from '@src/exceptions/catalog-errors';

describe('UserService', () => {
  let userService: UserService;
  let userRepositoryMock = mock<Repository<User>>();

  beforeEach(async () => {
    userService = new UserService(userRepositoryMock);
  });

  const userCreateDTO: UserCreateDTO = {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };

  const userEntity = plainToInstance(User, userCreateDTO);

  describe('createUser', () => {
    it('should create a new user', async () => {
      // ARRANGE
      const createdUser: User = {
        id: faker.number.int(),
        name: userCreateDTO.name,
        email: userCreateDTO.email,
        password: userCreateDTO.password,
        createdAt: new Date(),
        updatedAt: new Date(),
        accounts: [],
      };

      userRepositoryMock.save.mockResolvedValueOnce(createdUser);

      // ACT
      const result = await userService.createUser(userCreateDTO);

      // ASSERT
      expect(userRepositoryMock.save).toHaveBeenCalledWith(userEntity);
      expect(result).toBeUndefined();
    });

    it('should throw an error when the user already exists', async () => {
      // ARRANGE
      const db_duplicated_error = new QueryFailedError<any>(
        'query',
        [],
        new Error('', {}),
      );
      db_duplicated_error.driverError.code = '23505';

      userRepositoryMock.save.mockRejectedValueOnce(db_duplicated_error);
      let expectedError;

      // ACT
      try {
        await userService.createUser(userCreateDTO);
      } catch (error) {
        expectedError = error;
      }

      // ASSERT
      expect(userRepositoryMock.save).toHaveBeenCalledWith(userEntity);
      expect(expectedError).toEqual(CATALOG_ERRORS.DB_DUPLICATED_ERROR('user'));
    });

    it('should throw an error if an unexpected error occurs', async () => {
      // ARRANGE
      const expectedError = new Error('unexpected error');
      userRepositoryMock.save.mockRejectedValueOnce(expectedError);

      // ACT
      const promise = userService.createUser(userCreateDTO);

      // ASSERT
      expect(userRepositoryMock.save).toHaveBeenCalledWith(userEntity);
      await expect(promise).rejects.toThrow(expectedError);
    });
  });
});
