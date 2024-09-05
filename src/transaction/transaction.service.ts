import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';

import { Transaction } from '@src/transaction/transaction.entity';
import { TransactionCreateDTO } from '@src/transaction/dtos/transaction-create.dto';
import { TransactionListDTO } from '@src/transaction/dtos/transaction-list.dto';
import { TransactionFilterDTO } from '@src/transaction/dtos/transaction-filter.dto';
import { CATALOG_ERRORS } from '@src/exceptions/catalog-errors';
import { CreditCard } from '@src/creditCard/credit-card.entity';

import { ORMUtils } from '@src/common/orm-utils';
import { FinancialAccount } from '@src/financialAccount/financial-account.entity';

@Injectable()
export class TransactionService {
  private readonly _ormUtils: ORMUtils;

  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(CreditCard)
    private creditCardRepository: Repository<CreditCard>,
    @InjectRepository(FinancialAccount)
    private financialAccountRepository: Repository<FinancialAccount>,
  ) {
    this._ormUtils = new ORMUtils();
  }

  async createTransaction(userId: string, transaction: TransactionCreateDTO) {
    await this.verifyIfAccountAndCreditCardBelongsToUser(userId, transaction);

    const transactionEntity = plainToInstance(Transaction, transaction);

    try {
      await this.transactionRepository.save(transactionEntity);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        if (error.driverError.constraint === 'categoryIdFK') {
          throw CATALOG_ERRORS.CATEGORY_NOT_EXISTS;
        }
      }

      throw error;
    }
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
      order: {
        date: 'DESC',
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
        category: true,
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

  private async verifyIfAccountAndCreditCardBelongsToUser(
    userId: string,
    transaction: TransactionCreateDTO,
  ) {
    const financialAccount = await this.financialAccountRepository.findOneBy({
      id: transaction.financialAccountId,
      userId,
    });

    if (!financialAccount) {
      throw CATALOG_ERRORS.FINANCIAL_ACCOUNT_DOESNT_BELONG_TO_USER;
    }

    if (transaction.creditCardId) {
      const creditCard = await this.creditCardRepository.findOneBy({
        id: transaction.creditCardId,
        financialAccountId: transaction.financialAccountId,
      });

      if (!creditCard) {
        throw CATALOG_ERRORS.CREDIT_CARD_DOESNT_BELONG_TO_ACCOUNT;
      }
    }
  }
}
