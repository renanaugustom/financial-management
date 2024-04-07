import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';

import { Transaction } from '@src/transaction/transaction.entity';
import { TransactionCreateDTO } from '@src/transaction/dtos/transaction-create.dto';
import { TransactionListDTO } from '@src/transaction/dtos/transaction-list.dto';
import { TransactionFilterDTO } from '@src/transaction/dtos/transaction-filter.dto';
import { CATALOG_ERRORS } from '@src/exceptions/catalog-errors';
import { CreditCard } from '@src/creditCard/credit-card.entity';

import { ORMUtils } from '@src/common/orm-utils';

@Injectable()
export class TransactionService {
  private readonly _ormUtils: ORMUtils;

  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(CreditCard)
    private creditCardRepository: Repository<CreditCard>,
  ) {
    this._ormUtils = new ORMUtils();
  }

  async createTransaction(transaction: TransactionCreateDTO) {
    await this.verifyIfCreditCardBelongsToUser(transaction);

    const transactionEntity = plainToInstance(Transaction, transaction);

    await this.transactionRepository.save(transactionEntity);
  }

  async listByUserId(
    userId: string,
    filter: TransactionFilterDTO,
  ): Promise<Array<TransactionListDTO>> {
    const filterDate = this._ormUtils.filterByStartAndEndDate(
      filter.startDate,
      filter.endDate,
    );

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
        date: filterDate,
      },
    });

    return transactionsByUser.map((transaction) => {
      return plainToInstance(TransactionListDTO, transaction, {
        excludeExtraneousValues: true,
      });
    });
  }

  async listByUserAndCreditCard(
    userId: string,
    creditCardId: string,
  ): Promise<Array<TransactionListDTO>> {
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
  }

  private async verifyIfCreditCardBelongsToUser(
    transaction: TransactionCreateDTO,
  ) {
    if (transaction.creditCardId) {
      const creditCard = await this.creditCardRepository.findOneBy({
        id: transaction.creditCardId,
      });

      if (
        !creditCard ||
        creditCard.financialAccountId !== transaction.financialAccountId
      ) {
        throw CATALOG_ERRORS.CREDIT_CARD_DOESNT_BELONG_TO_ACCOUNT;
      }
    }
  }
}
