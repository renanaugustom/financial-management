import { QueryFailedError, Repository } from 'typeorm';

import { UserService } from '@src/user/user.service';
import { UserCreateDTO } from '@src/user/dtos/user-create.dto';
import { User } from '@src/user/user.entity';
import { mock } from 'jest-mock-extended';
import { faker } from '@faker-js/faker';
import { plainToInstance } from 'class-transformer';
import { CATALOG_ERRORS } from '@src/exceptions/catalog-errors';
import { UtilsService } from '@src/common/utils.service';

describe('UserService', () => {
  let userService: UserService;
  let userRepositoryMock = mock<Repository<User>>();
  let utilsServiceMock = mock<UtilsService>();

  const userCreateDTO: UserCreateDTO = {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };

  const hashedPassword = 'hashedPassword';

  let userEntity = plainToInstance(User, userCreateDTO);
  userEntity.password = hashedPassword;

  beforeEach(async () => {
    userService = new UserService(userRepositoryMock, utilsServiceMock);
    utilsServiceMock.hashString.mockResolvedValueOnce(hashedPassword);
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      // ARRANGE
      const createdUser: User = {
        id: faker.string.uuid(),
        name: userCreateDTO.name,
        email: userCreateDTO.email,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
        isAdmin: false,
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
      let result;
      try {
        await userService.createUser(userCreateDTO);
      } catch (error) {
        result = error;
      }

      // ASSERT
      expect(result).toEqual(expectedError);
      expect(userRepositoryMock.save).toHaveBeenCalledWith(userEntity);
    });
  });
});
