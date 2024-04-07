import { mock } from 'jest-mock-extended';
import { faker } from '@faker-js/faker/locale/af_ZA';

import { FinancialAccountController } from '@src/financialAccount/financial-account.controller';
import { FinancialAccountService } from '@src/financialAccount/financial-account.service';
import { FinancialAccountCreateDTO } from '@src/financialAccount/dtos/financial-account-create.dto';

describe('FinancialAccountController', () => {
  let financialAccountController: FinancialAccountController;

  const financialAccountServiceMock = mock<FinancialAccountService>();

  beforeEach(async () => {
    financialAccountController = new FinancialAccountController(
      financialAccountServiceMock,
    );
  });

  const newFinancialAccount: FinancialAccountCreateDTO = {
    balance: faker.number.int({ min: 0, max: 100000 }),
    name: faker.finance.accountName(),
    type: faker.helpers.arrayElement(['CHECKING', 'SAVINGS']),
    userId: faker.string.uuid(),
  };

  describe('create', () => {
    it('should create a new financial account', async () => {
      // ARRANGE
      financialAccountServiceMock.createAccount.mockReturnThis();

      // ACT
      await financialAccountController.create(newFinancialAccount);

      // ASSERT
      expect(financialAccountServiceMock.createAccount).toHaveBeenCalledWith(
        newFinancialAccount,
      );
    });

    it('should throw exception if create fails', async () => {
      // ARRANGE
      const expectedError = new Error('any error');

      financialAccountServiceMock.createAccount.mockRejectedValue(
        expectedError,
      );

      // ACT
      const promise = financialAccountController.create(newFinancialAccount);

      // ASSERT
      await expect(promise).rejects.toThrow(expectedError);
    });
  });
});
