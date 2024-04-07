import { Repository } from 'typeorm';
import { mock } from 'jest-mock-extended';

import { TransactionService } from '@src/transaction/transaction.service';
import { Transaction } from '@src/transaction/transaction.entity';
import { TransactionCreateDTO } from '@src/transaction/dtos/transaction-create.dto';
import { TransactionListDTO } from '@src/transaction/dtos/transaction-list.dto';
import { TransactionFilterDTO } from '@src/transaction/dtos/transaction-filter.dto';
import { plainToInstance } from 'class-transformer';
import { faker } from '@faker-js/faker';
import { Category } from '@src/category/category.entity';
import { CreditCard } from '@src/creditCard/credit-card.entity';
import { FinancialAccount } from '@src/financialAccount/financial-account.entity';
import { CATALOG_ERRORS } from '@src/exceptions/catalog-errors';
import { ORMUtils } from '@src/common/orm-utils';

describe('TransactionService', () => {
  let transactionService: TransactionService;
  let transactionRepositoryMock = mock<Repository<Transaction>>();
  let creditCardRepositoryMock = mock<Repository<CreditCard>>();

  beforeEach(async () => {
    transactionService = new TransactionService(
      transactionRepositoryMock,
      creditCardRepositoryMock,
    );
  });

  const creditCard: CreditCard = {
    id: faker.string.uuid(),
    description: 'My first credit card',
    brand: faker.finance.creditCardIssuer(),
    limit: faker.number.int({ min: 0, max: 100000 }),
    financialAccountId: faker.string.uuid(),
    invoiceDay: faker.number.int({ min: 1, max: 31 }),
    paymentDay: faker.number.int({ min: 1, max: 31 }),
    createdAt: new Date(),
    updatedAt: new Date(),
    financialAccount: new FinancialAccount(),
    transactions: [],
  };

  const newTransactionDTO: TransactionCreateDTO = {
    categoryId: faker.string.uuid(),
    date: new Date(),
    financialAccountId: creditCard.financialAccountId,
    type: faker.helpers.arrayElement(['INCOME', 'OUTCOME']),
    value: faker.number.int({ min: 0, max: 100000 }),
    creditCardId: creditCard.id,
  };

  const newTransactionEntity: Transaction = {
    categoryId: newTransactionDTO.categoryId,
    date: newTransactionDTO.date,
    financialAccountId: newTransactionDTO.financialAccountId,
    type: newTransactionDTO.type,
    value: newTransactionDTO.value,
    creditCardId: newTransactionDTO.creditCardId,
    createdAt: new Date(),
    updatedAt: new Date(),
    id: faker.string.uuid(),
    category: new Category(),
    creditCard: new CreditCard(),
    financialAccount: new FinancialAccount(),
  };

  describe('createTransaction', () => {
    it('should create a new transaction', async () => {
      // ARRANGE
      transactionRepositoryMock.save.mockResolvedValueOnce(
        newTransactionEntity,
      );

      creditCardRepositoryMock.findOneBy.mockResolvedValue(creditCard);

      const transactionEntity = plainToInstance(Transaction, newTransactionDTO);

      // ACT
      const result =
        await transactionService.createTransaction(newTransactionDTO);

      // ASS
      expect(transactionRepositoryMock.save).toHaveBeenCalledWith(
        transactionEntity,
      );
      expect(creditCardRepositoryMock.findOneBy).toHaveBeenCalledWith({
        id: newTransactionDTO.creditCardId,
      });
      expect(result).toBeUndefined();
    });

    it('should throw error if any error occurs', async () => {
      // ARRANGE
      const error = new Error('any error');
      creditCardRepositoryMock.findOneBy.mockRejectedValueOnce(error);

      // ACT
      const promise = transactionService.createTransaction(newTransactionDTO);

      //ASSERT
      await expect(promise).rejects.toThrow(error);
      expect(creditCardRepositoryMock.findOneBy).toHaveBeenCalledWith({
        id: newTransactionDTO.creditCardId,
      });
      expect(transactionRepositoryMock.save).not.toHaveBeenCalled();
    });

    it('should throw CREDIT_CARD_DOESNT_BELONG_TO_ACCOUNT if credit card doesn`t belong to user', async () => {
      // ARRANGE
      const expectedError = CATALOG_ERRORS.CREDIT_CARD_DOESNT_BELONG_TO_ACCOUNT;

      const anotherCreditCard: CreditCard = {
        id: faker.string.uuid(),
        description: 'Another credit card',
        brand: faker.finance.creditCardIssuer(),
        limit: faker.number.int({ min: 0, max: 100000 }),
        financialAccountId: faker.string.uuid(),
        invoiceDay: faker.number.int({ min: 1, max: 31 }),
        paymentDay: faker.number.int({ min: 1, max: 31 }),
        createdAt: new Date(),
        updatedAt: new Date(),
        financialAccount: new FinancialAccount(),
        transactions: [],
      };

      creditCardRepositoryMock.findOneBy.mockResolvedValue(anotherCreditCard);

      // ACT
      const promise = transactionService.createTransaction(newTransactionDTO);

      // ASSERT
      await expect(promise).rejects.toThrow(expectedError);
      expect(creditCardRepositoryMock.findOneBy).toHaveBeenCalledWith({
        id: newTransactionDTO.creditCardId,
      });
      expect(transactionRepositoryMock.save).not.toHaveBeenCalled();
    });
  });

  describe('listByUserId', () => {
    it('should return transactions filtered by user ID', async () => {
      // ARRANGE
      const ormUtils = new ORMUtils();

      const userId = faker.string.uuid();

      const filter: TransactionFilterDTO = {
        type: 'INCOME',
        financialAccountId: faker.string.uuid(),
        categoryId: faker.string.uuid(),
        endDate: new Date('2023-04-02T12:00:00'),
      };

      const transactions: Transaction[] = [
        {
          categoryId: filter.categoryId,
          date: new Date(),
          financialAccountId: filter.financialAccountId,
          type: filter.type,
          value: faker.number.int({ min: 0, max: 100000 }),
          creditCardId: faker.string.uuid(),
          createdAt: new Date(),
          updatedAt: new Date(),
          id: faker.string.uuid(),
          category: new Category(),
          creditCard: new CreditCard(),
          financialAccount: new FinancialAccount(),
        },
        {
          categoryId: filter.categoryId,
          date: new Date(),
          financialAccountId: filter.financialAccountId,
          type: filter.type,
          value: faker.number.int({ min: 0, max: 100000 }),
          creditCardId: faker.string.uuid(),
          createdAt: new Date(),
          updatedAt: new Date(),
          id: faker.string.uuid(),
          category: new Category(),
          creditCard: new CreditCard(),
          financialAccount: new FinancialAccount(),
        },
      ];

      transactionRepositoryMock.find.mockResolvedValue(transactions);

      // ACT
      const result = await transactionService.listByUserId(userId, filter);

      // ASSERT
      expect(result).toEqual(
        transactions.map((t) => {
          return plainToInstance(TransactionListDTO, t, {
            excludeExtraneousValues: true,
          });
        }),
      );

      expect(transactionRepositoryMock.find).toHaveBeenCalledWith({
        relations: {
          financialAccount: true,
          category: true,
        },
        where: {
          financialAccount: {
            userId,
          },
          type: filter.type,
          financialAccountId: filter.financialAccountId,
          categoryId: filter.categoryId,
          date: ormUtils.filterByStartAndEndDate(
            filter.startDate,
            filter.endDate,
          ),
        },
      });
    });

    it('should throw error if any error occurs', async () => {
      // ARRANGE
      const error = new Error('any error');
      transactionRepositoryMock.find.mockRejectedValueOnce(error);

      // ACT
      const promise = transactionService.listByUserId(
        faker.string.uuid(),
        {} as TransactionFilterDTO,
      );

      //ASSERT
      await expect(promise).rejects.toThrow(error);
    });
  });

  describe('listByUserAndCreditCard', () => {
    it('should return transactions filtered by user ID and credit card ID', async () => {
      // ARRANGE
      const userId = faker.string.uuid();
      const creditCardId = faker.string.uuid();

      const transactions: Transaction[] = [
        {
          categoryId: faker.string.uuid(),
          date: new Date(),
          financialAccountId: faker.string.uuid(),
          type: faker.helpers.arrayElement(['INCOME', 'OUTCOME']),
          value: faker.number.int({ min: 0, max: 100000 }),
          creditCardId,
          createdAt: new Date(),
          updatedAt: new Date(),
          id: faker.string.uuid(),
          category: new Category(),
          creditCard: new CreditCard(),
          financialAccount: new FinancialAccount(),
        },
        {
          categoryId: faker.string.uuid(),
          date: new Date(),
          financialAccountId: faker.string.uuid(),
          type: faker.helpers.arrayElement(['INCOME', 'OUTCOME']),
          value: faker.number.int({ min: 0, max: 100000 }),
          creditCardId,
          createdAt: new Date(),
          updatedAt: new Date(),
          id: faker.string.uuid(),
          category: new Category(),
          creditCard: new CreditCard(),
          financialAccount: new FinancialAccount(),
        },
      ];

      transactionRepositoryMock.find.mockResolvedValue(transactions);

      // ACT
      const result = await transactionService.listByUserAndCreditCard(
        userId,
        creditCardId,
      );

      // ASSERT
      expect(result).toEqual(
        transactions.map((t) => {
          return plainToInstance(TransactionListDTO, t, {
            excludeExtraneousValues: true,
          });
        }),
      );

      expect(transactionRepositoryMock.find).toHaveBeenCalledWith({
        relations: {
          financialAccount: true,
        },
        where: {
          financialAccount: {
            userId,
          },
          creditCardId,
        },
      });
    });

    it('should throw error if any error occurs', async () => {
      // ARRANGE
      const error = new Error('any error');
      transactionRepositoryMock.find.mockRejectedValueOnce(error);

      // ACT
      const promise = transactionService.listByUserAndCreditCard(
        faker.string.uuid(),
        faker.string.uuid(),
      );

      //ASSERT
      await expect(promise).rejects.toThrow(error);
    });
  });
});
