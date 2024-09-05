import { mock } from 'jest-mock-extended';
import { faker } from '@faker-js/faker';
import { Request } from 'express';

import { CreditCardController } from '@src/creditCard/credit-card.controller';
import { CreditCardService } from '@src/creditCard/credit-card.service';
import { CreditCardCreateDTO } from '@src/creditCard/dtos/credit-card-create.dto';
import { CATALOG_ERRORS } from '@src/exceptions/catalog-errors';
import { CreditCardGetDto } from '../dtos/credit-card-get.dto';

describe('CreditCardController', () => {
  let creditCardController: CreditCardController;

  const creditCardServiceMock = mock<CreditCardService>();
  const requestMock = mock<Request>();

  const userId = faker.string.uuid();

  const newCreditCard: CreditCardCreateDTO = {
    brand: faker.finance.creditCardIssuer(),
    description: 'My first credit card',
    limit: faker.number.int({ min: 0, max: 100000 }),
    invoiceDay: faker.number.int({ min: 1, max: 31 }),
    paymentDay: faker.number.int({ min: 1, max: 31 }),
    expirationDate: '20/30',
    financialAccountId: faker.string.uuid(),
  };

  beforeEach(async () => {
    creditCardController = new CreditCardController(creditCardServiceMock);
    requestMock['user'] = {
      sub: userId,
    };
  });

  describe('create', () => {
    it('should create a new credit card', async () => {
      // ARRANGE
      creditCardServiceMock.createCreditCard.mockResolvedValue(newCreditCard);

      // ACT
      const result = await creditCardController.create(
        requestMock,
        newCreditCard,
      );

      // ASSERT
      expect(result).toBeUndefined();
      expect(creditCardServiceMock.createCreditCard).toHaveBeenCalledWith(
        userId,
        newCreditCard,
      );
    });

    it('should throw exception if create fails', async () => {
      // ARRANGE
      const expectedError = CATALOG_ERRORS.SERVER_ERROR;

      creditCardServiceMock.createCreditCard.mockRejectedValue(expectedError);

      // ACT
      const promise = creditCardController.create(requestMock, newCreditCard);

      // ASSERT
      await expect(promise).rejects.toThrow(expectedError);
    });
  });

  describe('listByUser', () => {
    it('should list credit cards from user', async () => {
      // ARRANGE
      const creditCardList = [
        {
          id: faker.string.uuid(),
          brand: faker.finance.creditCardIssuer(),
          description: 'My first',
        } as CreditCardGetDto,
      ];

      creditCardServiceMock.listByUser.mockResolvedValue(creditCardList);

      // ACT
      const result = await creditCardController.listByUser(requestMock);

      // ASSERT
      expect(result).toEqual(creditCardList);
      expect(creditCardServiceMock.listByUser).toHaveBeenCalledWith(userId);
    });

    it('should throw exception if list fails', async () => {
      // ARRANGE
      const expectedError = CATALOG_ERRORS.SERVER_ERROR;

      creditCardServiceMock.listByUser.mockRejectedValue(expectedError);

      // ACT
      const promise = creditCardController.listByUser(requestMock);

      // ASSERT
      await expect(promise).rejects.toThrow(expectedError);
    });
  });
});
