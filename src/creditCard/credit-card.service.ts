import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';

import { CreditCard } from '@src/creditCard/credit-card.entity';
import { CreditCardCreateDTO } from '@src/creditCard/dtos/credit-card-create.dto';
import { CATALOG_ERRORS } from '@src/exceptions/catalog-errors';
import { CreditCardGetDto } from '@src/creditCard/dtos/credit-card-get.dto';
import { FinancialAccount } from '@src/financialAccount/financial-account.entity';

@Injectable()
export class CreditCardService {
  constructor(
    @InjectRepository(CreditCard)
    private creditCardRepository: Repository<CreditCard>,
    @InjectRepository(FinancialAccount)
    private financialAccountRepository: Repository<FinancialAccount>,
  ) {}

  async createCreditCard(
    userId: string,
    creditCard: CreditCardCreateDTO,
  ): Promise<CreditCardCreateDTO> {
    await this._checkIfAccountBelongsToUser(
      userId,
      creditCard.financialAccountId,
    );

    const creditCardEntity = plainToInstance(CreditCard, creditCard);

    await this.creditCardRepository.save(creditCardEntity);

    return creditCard;
  }

  async getById(creditCardId: string): Promise<CreditCardGetDto> {
    const creditCardEntity = await this.creditCardRepository.findOneBy({
      id: creditCardId,
    });

    if (!creditCardEntity) {
      throw CATALOG_ERRORS.CREDIT_CARD_NOT_FOUND;
    }

    return plainToInstance(CreditCardGetDto, creditCardEntity);
  }

  async listByUser(userId: string): Promise<CreditCardGetDto[]> {
    const creditCards = await this.creditCardRepository.find({
      relations: {
        financialAccount: true,
      },
      where: {
        financialAccount: {
          userId,
        },
      },
    });

    return creditCards.map((creditCard) =>
      plainToInstance(CreditCardGetDto, creditCard, {
        excludeExtraneousValues: true,
      }),
    );
  }

  private async _checkIfAccountBelongsToUser(
    userId: string,
    financialAccountId: string,
  ) {
    const financialAccount = await this.financialAccountRepository.findOneBy({
      id: financialAccountId,
      userId,
    });

    if (!financialAccount)
      throw CATALOG_ERRORS.FINANCIAL_ACCOUNT_DOESNT_BELONG_TO_USER;
  }
}
