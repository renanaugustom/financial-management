import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';

import { CreditCard } from '@src/creditCard/credit-card.entity';
import { CreditCardCreateDTO } from '@src/creditCard/dtos/credit-card-create.dto';
import { CATALOG_ERRORS } from '@src/exceptions/catalog-errors';
import { CreditCardGetDto } from '@src/creditCard/dtos/credit-card-get.dto';

@Injectable()
export class CreditCardService {
  constructor(
    @InjectRepository(CreditCard)
    private creditCardRepository: Repository<CreditCard>,
  ) {}

  async createCreditCard(
    creditCard: CreditCardCreateDTO,
  ): Promise<CreditCardCreateDTO> {
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
}
