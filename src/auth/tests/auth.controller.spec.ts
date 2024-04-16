import { mock } from 'jest-mock-extended';
import { faker } from '@faker-js/faker';

import { AuthController } from '@src/auth/auth.controller';
import { AuthService } from '@src/auth/auth.service';
import { LoginDTO } from '@src/auth/dtos/login.dto';
import { LoginResponseDTO } from '@src/auth/dtos/login-response.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authServiceMock = mock<AuthService>();

  const loginDto: LoginDTO = {
    email: faker.internet.email(),
    password: faker.internet.password(),
  };

  beforeEach(async () => {
    authController = new AuthController(authServiceMock);
  });

  describe('login', () => {
    it('should login user and return access token', async () => {
      // ARRANGE
      const expectedResponse: LoginResponseDTO = {
        accessToken: faker.string.sample(),
      };

      authServiceMock.signIn.mockResolvedValue(expectedResponse);

      // ACT
      const result = await authController.login(loginDto);

      // ASSERT
      expect(result).toEqual(expectedResponse);
      expect(authServiceMock.signIn).toHaveBeenCalledWith(
        loginDto.email,
        loginDto.password,
      );
    });

    it('should throw error if login fails', async () => {
      // ARRANGE
      const loginDto: LoginDTO = {
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      const expectedError = new Error('Login failed');
      authServiceMock.signIn.mockRejectedValue(expectedError);

      // ACT
      let result;

      try {
        await authController.login(loginDto);
      } catch (error) {
        result = error;
      }

      // ASSERT
      expect(result).toEqual(expectedError);
    });
  });
});
