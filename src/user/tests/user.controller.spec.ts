import { mock } from 'jest-mock-extended';

import { UserController } from '@src/user/user.controller';
import { UserService } from '@src/user/user.service';
import { UserCreateDTO } from '@src/user/dtos/user-create.dto';
import { faker } from '@faker-js/faker';

describe('UserController', () => {
  let userController: UserController;
  let userServiceMock = mock<UserService>();

  beforeEach(async () => {
    userController = new UserController(userServiceMock);
  });

  const newUser: UserCreateDTO = {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };

  describe('create', () => {
    it('should create a new user', async () => {
      // ACT
      await userController.create(newUser);

      // ASSERT
      expect(userServiceMock.createUser).toHaveBeenCalledWith(newUser);
    });

    it('should throw error if any error occurs', async () => {
      // ARRANGE
      const error = new Error('any error');

      userServiceMock.createUser.mockRejectedValue(error);

      // ACT
      const promise = userController.create(newUser);

      // ASSERT
      await expect(promise).rejects.toThrow(error);
    });
  });
});
