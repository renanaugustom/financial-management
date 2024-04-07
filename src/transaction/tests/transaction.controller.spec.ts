import { mock } from 'jest-mock-extended';
import { faker } from '@faker-js/faker';

import { TransactionController } from '@src/transaction/transaction.controller';
import { TransactionService } from '@src/transaction/transaction.service';
import { TransactionCreateDTO } from '@src/transaction/dtos/transaction-create.dto';
import { TransactionListDTO } from '@src/transaction/dtos/transaction-list.dto';
import { TransactionFilterDTO } from '@src/transaction/dtos/transaction-filter.dto';

describe('TransactionController', () => {
  let transactionController: TransactionController;
  let transactionServiceMock = mock<TransactionService>();

  beforeEach(async () => {
    transactionController = new TransactionController(transactionServiceMock);
  });

  const newTransactionDTO: TransactionCreateDTO = {
    categoryId: faker.string.uuid(),
    date: new Date(),
    financialAccountId: faker.string.uuid(),
    type: faker.helpers.arrayElement(['INCOME', 'OUTCOME']),
    value: faker.number.int({ min: 0, max: 100000 }),
    creditCardId: faker.string.uuid(),
  };

  const userId = faker.string.uuid();

  const transactionGetDTO: TransactionFilterDTO = {
    categoryId: faker.string.uuid(),
    startDate: new Date(),
    endDate: new Date(),
    financialAccountId: faker.string.uuid(),
    type: faker.helpers.arrayElement(['INCOME', 'OUTCOME']),
  };

  const creditCardId = faker.string.uuid();

  describe('create', () => {
    it('should create a new transaction', async () => {
      // ARRANGE
      transactionServiceMock.createTransaction.mockResolvedValueOnce(undefined);

      // ACT
      await transactionController.create(newTransactionDTO);

      // ASSERT
      expect(transactionServiceMock.createTransaction).toHaveBeenCalledWith(
        newTransactionDTO,
      );
    });

    it('should throw exception if createTransaction fails', async () => {
      // ARRANGE
      const expectedError = new Error('any error');

      transactionServiceMock.createTransaction.mockRejectedValueOnce(
        expectedError,
      );

      // ACT
      const promise = transactionController.create(newTransactionDTO);

      // ASSERT
      await expect(promise).rejects.toThrow(expectedError);
    });
  });

  describe('filterByUser', () => {
    it('should filter transactions by user ID', async () => {
      // ARRANGE
      const expectedTransactions: TransactionListDTO[] = [
        {
          categoryId: transactionGetDTO.categoryId,
          date: new Date(),
          financialAccountId: transactionGetDTO.financialAccountId,
          categoryName: faker.string.sample(),
          value: faker.number.int({ min: 0, max: 100000 }),
          type: transactionGetDTO.type,
          financialAccountName: faker.finance.accountName(),
        },
      ];

      const TransactionFilterDTO: TransactionFilterDTO = {
        categoryId: transactionGetDTO.categoryId,
        startDate: transactionGetDTO.startDate,
        endDate: transactionGetDTO.endDate,
        financialAccountId: transactionGetDTO.financialAccountId,
        type: transactionGetDTO.type,
      };

      transactionServiceMock.listByUserId.mockResolvedValueOnce(
        expectedTransactions,
      );

      // ACT
      const result = await transactionController.filterByUser(
        userId,
        transactionGetDTO.type,
        transactionGetDTO.startDate,
        transactionGetDTO.endDate,
        transactionGetDTO.financialAccountId,
        transactionGetDTO.categoryId,
      );

      // ASSERT
      expect(transactionServiceMock.listByUserId).toHaveBeenCalledWith(
        userId,
        TransactionFilterDTO,
      );

      expect(result).toEqual(expectedTransactions);
    });

    it('should throw exception if listByUserId fails', async () => {
      // ARRANGE
      const expectedError = new Error('any error');

      transactionServiceMock.listByUserId.mockRejectedValueOnce(expectedError);

      // ACT
      const promise = transactionController.filterByUser(
        userId,
        transactionGetDTO.type,
        transactionGetDTO.startDate,
        transactionGetDTO.endDate,
        transactionGetDTO.financialAccountId,
        transactionGetDTO.categoryId,
      );

      // ASSERT
      await expect(promise).rejects.toThrow(expectedError);
    });
  });

  describe('filterByCreditCard', () => {
    it('should filter transactions by user ID and credit card ID', async () => {
      // ARRANGE
      const expectedTransactions: TransactionListDTO[] = [
        {
          categoryId: faker.string.uuid(),
          date: new Date(),
          financialAccountId: faker.string.uuid(),
          categoryName: faker.string.sample(),
          value: faker.number.int({ min: 0, max: 100000 }),
          type: faker.helpers.arrayElement(['INCOME', 'OUTCOME']),
          financialAccountName: faker.finance.accountName(),
        },
      ];

      transactionServiceMock.listByUserAndCreditCard.mockResolvedValueOnce(
        expectedTransactions,
      );

      // ACT
      const result = await transactionController.filterByCreditCard(
        userId,
        creditCardId,
      );

      // ASSERT
      expect(
        transactionServiceMock.listByUserAndCreditCard,
      ).toHaveBeenCalledWith(userId, creditCardId);

      expect(result).toEqual(expectedTransactions);
    });

    it('should throw exception if listByUserAndCreditCard fails', async () => {
      // ARRANGE
      const expectedError = new Error('any error');

      transactionServiceMock.listByUserAndCreditCard.mockRejectedValueOnce(
        expectedError,
      );

      // ACT
      const promise = transactionController.filterByCreditCard(
        userId,
        creditCardId,
      );

      // ASSERT
      await expect(promise).rejects.toThrow(expectedError);
    });
  });
});
