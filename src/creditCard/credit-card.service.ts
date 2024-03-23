import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { CreditCard } from 'creditCard/credit-card.entity';
import { CreditCardCreateDTO } from 'creditCard/dtos/credit-card-create.dto';
import { CATALOG_ERRORS } from 'expceptions/catalog-errors';

@Injectable()
export class CreditCardService {
  constructor(
    @InjectRepository(CreditCard)
    private creditCardRepository: Repository<CreditCard>,
  ) {}

  async createCreditCard(creditCard: CreditCardCreateDTO): Promise<CreditCard> {
    try {
      const creditCardEntity = plainToInstance(CreditCard, creditCard);

      return await this.creditCardRepository.save(creditCardEntity);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getById(creditCardId: string): Promise<CreditCard> {
    try {
      return await this.creditCardRepository.findOneBy({
        id: creditCardId,
      });
    } catch (error) {
      console.log(error);
      throw CATALOG_ERRORS.SERVER_ERROR;
    }
  }
}
