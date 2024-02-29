import { Injectable } from '@nestjs/common';
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

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  async createTransaction(
    transaction: TransactionCreateDTO,
  ): Promise<Transaction> {
    try {
      const transactionEntity = plainToInstance(Transaction, transaction);

      return this.transactionRepository.save(transactionEntity);
    } catch (error) {}
  }

  async listByUserId(
    userId: string,
    filter: TransactionFilterDTO,
  ): Promise<Array<TransactionListDTO>> {
    try {
      const transactionsByUser = await this.transactionRepository.find({
        relations: {
          account: true,
          category: true,
        },
        where: {
          account: {
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
    }
  }

  private _filterDate(startDate?: Date, endDate?: Date): FindOperator<Date> {
    const formatedStartDate = startDate
      ? new Date(startDate.toString().split('T')[0])
      : null;

    const formatedEndDate = endDate
      ? new Date(new Date(endDate).setHours(23, 59, 59, 999))
      : null;

    if (!startDate && !endDate) return;

    if (startDate && !endDate) return MoreThanOrEqual(formatedStartDate);

    if (!startDate && endDate) return LessThanOrEqual(formatedEndDate);

    return Between(formatedStartDate, formatedEndDate);
  }
}
