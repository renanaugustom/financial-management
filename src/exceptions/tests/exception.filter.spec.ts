import { Test, TestingModule } from '@nestjs/testing';
import { HttpExceptionFilter } from '../exception.filter';
import { APIError } from '../api-error';
import { faker } from '@faker-js/faker';
import { CATALOG_ERRORS } from '../catalog-errors';

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;

  const jsonMock = jest.fn();

  const resMock = {
    status: jest.fn(() => ({
      json: jsonMock,
    })),
  };

  const ctxMock = {
    getResponse: jest.fn(),
    getRequest: jest.fn(),
    getNext: jest.fn(),
  };

  ctxMock.getResponse.mockReturnValue(resMock);

  const hostMock = {
    switchToHttp: jest.fn(() => ctxMock),
    getArgByIndex: jest.fn(),
    getArgs: jest.fn(),
    getType: jest.fn(),
    switchToRpc: jest.fn(),
    switchToWs: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HttpExceptionFilter],
    }).compile();

    filter = await module.resolve<HttpExceptionFilter>(HttpExceptionFilter);
  });

  it('should catch custom APIError and return errorCode and message ', () => {
    const customException = new APIError(
      400,
      faker.string.sample(),
      faker.string.sample(),
    );

    // ACT
    filter.catch(customException, hostMock);

    // ASSERT
    expect(resMock.status).toHaveBeenCalledWith(customException.getStatus());
    expect(jsonMock).toHaveBeenCalledWith({
      errorCode: customException.errorCode,
      message: customException.message,
    });
  });

  it('should throw 500 if error is not an http exception', () => {
    const errorMessage = faker.string.sample();
    const customException = new Error(errorMessage);

    // ACT
    filter.catch(customException, hostMock);

    // ASSERT
    expect(resMock.status).toHaveBeenCalledWith(
      CATALOG_ERRORS.SERVER_ERROR.getStatus(),
    );
    expect(jsonMock).toHaveBeenCalledWith({
      errorCode: CATALOG_ERRORS.SERVER_ERROR.errorCode,
      message: CATALOG_ERRORS.SERVER_ERROR.message,
    });
  });
});
