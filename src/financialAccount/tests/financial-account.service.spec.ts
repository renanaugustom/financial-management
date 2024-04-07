import { Repository } from 'typeorm';
import { mock } from 'jest-mock-extended';

import { FinancialAccountService } from '@src/financialAccount/financial-account.service';
import { FinancialAccount } from '@src/financialAccount/financial-account.entity';
import { FinancialAccountCreateDTO } from '@src/financialAccount/dtos/financial-account-create.dto';
import { faker } from '@faker-js/faker';
import { plainToInstance } from 'class-transformer';

describe('FinancialAccountService', () => {
  let financialAccountService: FinancialAccountService;
  let financialAccountRepositoryMock = mock<Repository<FinancialAccount>>();

  beforeEach(async () => {
    financialAccountService = new FinancialAccountService(
      financialAccountRepositoryMock,
    );
  });

  const newFinancialAccountDto: FinancialAccountCreateDTO = {
    balance: faker.number.int({ min: 0, max: 100000 }),
    name: faker.finance.accountName(),
    type: faker.helpers.arrayElement(['CHECKING', 'SAVINGS']),
    userId: faker.string.uuid(),
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
      await financialAccountService.createAccount(newFinancialAccountDto);

      expect(financialAccountRepositoryMock.save).toHaveBeenCalledWith(
        newFinancialAccountDto,
      );
    });

    it('should throw exception if createAccount fails', async () => {
      // ARRANGE
      const expectedError = new Error('any error');

      financialAccountRepositoryMock.save.mockRejectedValueOnce(expectedError);

      // ACT
      const promise = financialAccountService.createAccount(
        newFinancialAccountDto,
      );

      // ASSERT
      await expect(promise).rejects.toThrow(expectedError);
    });
  });
});
