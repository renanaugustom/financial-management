import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  Repository,
  FindOperator,
  MoreThanOrEqual,
  LessThanOrEqual,
} from 'typeorm';
import { plainToInstance } from 'class-transformer';

import { Transaction } from 'transaction/transaction.entity';
import { TransactionCreateDTO } from 'transaction/dtos/transaction-create.dto';
import { TransactionListDTO } from 'transaction/dtos/transaction-list.dto';
import { TransactionFilterDTO } from 'transaction/dtos/transaction-filter.dto';
import { CreditCardService } from 'creditCard/credit-card.service';
import { CATALOG_ERRORS } from 'expceptions/catalog-errors';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @Inject(CreditCardService)
    private creditCardService: CreditCardService,
  ) {}

  async createTransaction(
    transaction: TransactionCreateDTO,
  ): Promise<Transaction> {
    try {
      await this.verifyIfCreditCardBelongsToUser(transaction);

      const transactionEntity = plainToInstance(Transaction, transaction);

      return await this.transactionRepository.save(transactionEntity);
    } catch (error) {
      console.log(error);
      throw CATALOG_ERRORS.SERVER_ERROR;
    }
  }

  async listByUserId(
    userId: string,
    filter: TransactionFilterDTO,
  ): Promise<Array<TransactionListDTO>> {
    try {
      const transactionsByUser = await this.transactionRepository.find({
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
          date: this._filterDate(filter.startDate, filter.endDate),
        },
      });

      return transactionsByUser.map((transaction) => {
        return plainToInstance(TransactionListDTO, transaction, {
          excludeExtraneousValues: true,
        });
      });
    } catch (error) {
      console.log(error);
      throw CATALOG_ERRORS.SERVER_ERROR;
    }
  }

  async listByUserAndCreditCard(
    userId: string,
    creditCardId: string,
  ): Promise<Array<TransactionListDTO>> {
    try {
      const transactions = await this.transactionRepository.find({
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

      return transactions.map((transaction) => {
        return plainToInstance(TransactionListDTO, transaction, {
          excludeExtraneousValues: true,
        });
      });
    } catch (error) {
      console.log(error);
      throw CATALOG_ERRORS.SERVER_ERROR;
    }
  }

  private async verifyIfCreditCardBelongsToUser(
    transaction: TransactionCreateDTO,
  ) {
    if (transaction.creditCardId) {
      const creditCard = await this.creditCardService.getById(
        transaction.creditCardId,
      );

      if (
        !creditCard ||
        creditCard.financialAccountId !== transaction.financialAccountId
      ) {
        throw CATALOG_ERRORS.CREDIT_CARD_DOESNT_BELONG_TO_ACCOUNT;
      }
    }
  }

  private _filterDate(startDate?: Date, endDate?: Date): FindOperator<Date> {
    const formattedStartDate = startDate
      ? new Date(startDate.toString().split('T')[0])
      : null;

    const formattedEndDate = endDate
      ? new Date(new Date(endDate).setHours(23, 59, 59, 999))
      : null;

    if (!startDate && !endDate) return;

    if (startDate && !endDate) return MoreThanOrEqual(formattedStartDate);

    if (!startDate && endDate) return LessThanOrEqual(formattedEndDate);

    return Between(formattedStartDate, formattedEndDate);
  }
}
