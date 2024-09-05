import { QueryFailedError, Repository } from 'typeorm';
import { mock } from 'jest-mock-extended';

import { FinancialAccountService } from '@src/financialAccount/financial-account.service';
import { FinancialAccount } from '@src/financialAccount/financial-account.entity';
import { FinancialAccountCreateDTO } from '@src/financialAccount/dtos/financial-account-create.dto';
import { faker } from '@faker-js/faker';
import { plainToInstance } from 'class-transformer';
import { CATALOG_ERRORS } from '@src/exceptions/catalog-errors';
import { FinancialAccountListDTO } from '@src/financialAccount/dtos/financial-account-list.dto';

describe('FinancialAccountService', () => {
  let financialAccountService: FinancialAccountService;
  let financialAccountRepositoryMock = mock<Repository<FinancialAccount>>();

  beforeEach(async () => {
    financialAccountService = new FinancialAccountService(
      financialAccountRepositoryMock,
    );
  });

  const userId = faker.string.uuid();

  const newFinancialAccountDto: FinancialAccountCreateDTO = {
    balance: faker.number.int({ min: 0, max: 100000 }),
    name: faker.finance.accountName(),
    type: faker.helpers.arrayElement(['CHECKING', 'SAVINGS']),
  };

  describe('createAccount', () => {
    it('should create a new financial account', async () => {
      // ARRANGE
      const newFinancialAccountEntity = plainToInstance(
        FinancialAccount,
        newFinancialAccountDto,
      );

      financialAccountRepositoryMock.save.mockResolvedValue(
        newFinancialAccountEntity,
      );

      // ACT
      await financialAccountService.createAccount(
        newFinancialAccountDto,
        userId,
      );

      expect(financialAccountRepositoryMock.save).toHaveBeenCalledWith({
        ...newFinancialAccountDto,
        userId,
      });
    });

    it('should throw exception if createAccount fails', async () => {
      // ARRANGE
      const expectedError = new Error('any error');

      financialAccountRepositoryMock.save.mockRejectedValueOnce(expectedError);

      // ACT
      const promise = financialAccountService.createAccount(
        newFinancialAccountDto,
        userId,
      );

      // ASSERT
      await expect(promise).rejects.toThrow(expectedError);
    });

    it('should throw exception if user does not exists', async () => {
      // ARRANGE
      const dbUserFkError = new QueryFailedError<any>(
        'query',
        [],
        new Error('', {}),
      );
      dbUserFkError.driverError.constraint = 'userIdFK';

      const expectedError = CATALOG_ERRORS.USER_NOT_EXISTS;

      financialAccountRepositoryMock.save.mockRejectedValueOnce(dbUserFkError);

      // ACT
      const promise = financialAccountService.createAccount(
        newFinancialAccountDto,
        userId,
      );

      // ASSERT
      await expect(promise).rejects.toThrow(expectedError);
    });
  });

  describe('listByUserId', () => {
    it('should list financial accounts by user ID', async () => {
      // ARRANGE
      const financialAccountResponse = [
        {
          id: faker.string.uuid(),
          balance: faker.number.int({ min: 0, max: 100000 }),
          name: faker.finance.accountName(),
          type: faker.helpers.arrayElement(['CHECKING', 'SAVINGS']),
          userId,
          createdAt: faker.date.recent(),
          updatedAt: faker.date.recent(),
        },
      ] as FinancialAccount[];

      financialAccountRepositoryMock.find.mockResolvedValue(
        financialAccountResponse,
      );

      const expectedResult = financialAccountResponse.map((account) => {
        return plainToInstance(FinancialAccountListDTO, account, {
          excludeExtraneousValues: true,
        });
      });

      // ACT
      const result = await financialAccountService.listByUserId(userId);

      // ASSERT
      expect(financialAccountRepositoryMock.find).toHaveBeenCalledWith({
        where: { userId },
      });
      expect(result).toEqual(expectedResult);
    });

    it('should return an empty array if no financial accounts are found', async () => {
      // ARRANGE
      financialAccountRepositoryMock.find.mockResolvedValue([]);

      // ACT
      const result = await financialAccountService.listByUserId(userId);

      // ASSERT
      expect(financialAccountRepositoryMock.find).toHaveBeenCalledWith({
        where: { userId },
      });
      expect(result).toEqual([]);
    });

    it('should throw exception if listByUserId fails', async () => {
      // ARRANGE
      const expectedError = new Error('any error');

      financialAccountRepositoryMock.find.mockRejectedValueOnce(expectedError);

      // ACT
      const promise = financialAccountService.listByUserId(userId);

      // ASSERT
      await expect(promise).rejects.toThrow(expectedError);
    });
  });
});
