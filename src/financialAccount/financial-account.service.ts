import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';

import { FinancialAccount } from '@src/financialAccount/financial-account.entity';
import { FinancialAccountCreateDTO } from '@src/financialAccount/dtos/financial-account-create.dto';
import { CATALOG_ERRORS } from '@src/exceptions/catalog-errors';
import { FinancialAccountListDTO } from '@src/financialAccount/dtos/financial-account-list.dto';

@Injectable()
export class FinancialAccountService {
  constructor(
    @InjectRepository(FinancialAccount)
    private accountRepository: Repository<FinancialAccount>,
  ) {}

  async createAccount(
    financialAccount: FinancialAccountCreateDTO,
    userId: string,
  ) {
    const financialAccountEntity = plainToInstance(
      FinancialAccount,
      financialAccount,
    );

    financialAccountEntity.userId = userId;
    financialAccountEntity.balance = financialAccount.initialBalance;

    try {
      await this.accountRepository.save(financialAccountEntity);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        if (error.driverError.constraint === 'userIdFK') {
          throw CATALOG_ERRORS.USER_NOT_EXISTS;
        }
      }

      throw error;
    }
  }

  async listByUserId(userId: string): Promise<FinancialAccountListDTO[]> {
    const accountEntities = await this.accountRepository.find({
      where: { userId },
    });

    return accountEntities.map((account) => {
      return plainToInstance(FinancialAccountListDTO, account, {
        excludeExtraneousValues: true,
      });
    });
  }
}
