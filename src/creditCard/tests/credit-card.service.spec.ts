import { faker } from '@faker-js/faker';
import { mock } from 'jest-mock-extended';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';

import { CreditCardService } from '@src/creditCard/credit-card.service';
import { CreditCard } from '@src/creditCard/credit-card.entity';
import { CreditCardCreateDTO } from '@src/creditCard/dtos/credit-card-create.dto';
import { CreditCardGetDto } from '@src/creditCard/dtos/credit-card-get.dto';
import { CATALOG_ERRORS } from '@src/exceptions/catalog-errors';

describe('CreditCardService', () => {
  let creditCardService: CreditCardService;

  const creditCardRepositoryMock = mock<Repository<CreditCard>>();

  beforeEach(async () => {
    creditCardService = new CreditCardService(creditCardRepositoryMock);
  });

  const newCreditCard: CreditCardCreateDTO = {
    brand: faker.finance.creditCardIssuer(),
    description: 'My first credit card',
    limit: faker.number.int({ min: 0, max: 100000 }),
    invoiceDay: faker.number.int({ min: 1, max: 31 }),
    paymentDay: faker.number.int({ min: 1, max: 31 }),
    financialAccountId: faker.string.uuid(),
  };

  const newCreditCardEntity = plainToInstance(CreditCard, newCreditCard);

  describe('createCreditCard', () => {
    it('should create a new credit card', async () => {
      // ARRANGE
      creditCardRepositoryMock.save.mockResolvedValueOnce(newCreditCardEntity);

      // ACT
      const result = await creditCardService.createCreditCard(newCreditCard);

      // ASSERT
      expect(result).toEqual(newCreditCard);
      expect(creditCardRepositoryMock.save).toHaveBeenCalledWith(
        newCreditCardEntity,
      );
    });

    it('should throw exception if createCreditCard fails', async () => {
      // ARRANGE
      const expectedError = new Error('any error');

      creditCardRepositoryMock.save.mockRejectedValueOnce(expectedError);

      // ACT
      const promise = creditCardService.createCreditCard(newCreditCard);

      // ASSERT
      await expect(promise).rejects.toThrow(expectedError);
    });
  });

  describe('getById', () => {
    it('should return a credit card by ID', async () => {
      // ARRANGE
      const creditCardId = faker.string.uuid();
      const expectedResult = plainToInstance(
        CreditCardGetDto,
        newCreditCardEntity,
      );

      creditCardRepositoryMock.findOneBy.mockResolvedValueOnce(
        newCreditCardEntity,
      );

      // ACT
      const result = await creditCardService.getById(creditCardId);

      expect(result).toEqual(expectedResult);
      expect(creditCardRepositoryMock.findOneBy).toHaveBeenCalledWith({
        id: creditCardId,
      });
    });

    it('should throw server error exception if getById fails', async () => {
      // ARRANGE
      const creditCardId = faker.string.uuid();
      const expectedError = new Error('any error');

      creditCardRepositoryMock.findOneBy.mockRejectedValueOnce(expectedError);

      // ACT
      const promise = creditCardService.getById(creditCardId);

      // ASSERT
      await expect(promise).rejects.toThrow(expectedError);
    });

    it('should throw CARD_NOT_FOUND exception if getById does not find a credit card', async () => {
      // ARRANGE
      const creditCardId = faker.string.uuid();
      const expectedError = CATALOG_ERRORS.CREDIT_CARD_NOT_FOUND;

      creditCardRepositoryMock.findOneBy.mockResolvedValueOnce(null);

      // ACT
      const promise = creditCardService.getById(creditCardId);

      // ASSERT
      await expect(promise).rejects.toThrow(expectedError);
    });
  });
});
