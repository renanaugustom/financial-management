import { mock } from 'jest-mock-extended';
import { faker } from '@faker-js/faker/locale/af_ZA';
import { Request } from 'express';

import { FinancialAccountController } from '@src/financialAccount/financial-account.controller';
import { FinancialAccountService } from '@src/financialAccount/financial-account.service';
import { FinancialAccountCreateDTO } from '@src/financialAccount/dtos/financial-account-create.dto';
import {
  FinancialAccountDTO,
  FinancialAccountListDTO,
} from '@src/financialAccount/dtos/financial-account-list.dto';

describe('FinancialAccountController', () => {
  let financialAccountController: FinancialAccountController;

  const financialAccountServiceMock = mock<FinancialAccountService>();
  const requestMock = mock<Request>();

  const userId = faker.string.uuid();

  beforeEach(async () => {
    financialAccountController = new FinancialAccountController(
      financialAccountServiceMock,
    );
    requestMock['user'] = {
      sub: userId,
    };
  });

  const newFinancialAccount: FinancialAccountCreateDTO = {
    initialBalance: faker.number.int({ min: 0, max: 100000 }),
    name: faker.finance.accountName(),
    type: faker.helpers.arrayElement(['CHECKING', 'SAVINGS']),
  };

  describe('create', () => {
    it('should create a new financial account', async () => {
      // ARRANGE
      financialAccountServiceMock.createAccount.mockReturnThis();

      // ACT
      await financialAccountController.create(newFinancialAccount, requestMock);

      // ASSERT
      expect(financialAccountServiceMock.createAccount).toHaveBeenCalledWith(
        newFinancialAccount,
        userId,
      );
    });

    it('should throw exception if create fails', async () => {
      // ARRANGE
      const expectedError = new Error('any error');

      financialAccountServiceMock.createAccount.mockRejectedValue(
        expectedError,
      );

      // ACT
      const promise = financialAccountController.create(
        newFinancialAccount,
        requestMock,
      );

      // ASSERT
      await expect(promise).rejects.toThrow(expectedError);
    });
  });

  describe('listByUserId', () => {
    it('should list financial accounts by user ID', async () => {
      // ARRANGE
      const accountBalance = faker.number.int({ min: 0, max: 100000 });

      const financialAccountResponse = {
        accountsTotalBalance: accountBalance,
        accounts: [
          {
            id: faker.string.uuid(),
            balance: accountBalance,
            name: faker.finance.accountName(),
            type: faker.helpers.arrayElement(['CHECKING', 'SAVINGS']),
            userId,
          },
        ] as FinancialAccountDTO[],
      } as FinancialAccountListDTO;

      financialAccountServiceMock.listByUserId.mockResolvedValue(
        financialAccountResponse,
      );

      // ACT
      const result = await financialAccountController.listByUserId(requestMock);

      // ASSERT
      expect(financialAccountServiceMock.listByUserId).toHaveBeenCalledWith(
        userId,
      );
      expect(result).toEqual(financialAccountResponse);
    });

    it('should throw exception if list fails', async () => {
      // ARRANGE
      const expectedError = new Error('any error');

      financialAccountServiceMock.listByUserId.mockRejectedValue(expectedError);

      // ACT
      const promise = financialAccountController.listByUserId(requestMock);

      // ASSERT
      await expect(promise).rejects.toThrow(expectedError);
    });
  });
});
