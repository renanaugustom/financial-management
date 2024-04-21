import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';

import { FinancialAccount } from '@src/financialAccount/financial-account.entity';
import { FinancialAccountCreateDTO } from '@src/financialAccount/dtos/financial-account-create.dto';
import { CATALOG_ERRORS } from '@src/exceptions/catalog-errors';

@Injectable()
export class FinancialAccountService {
  constructor(
    @InjectRepository(FinancialAccount)
    private accountRepository: Repository<FinancialAccount>,
  ) {}

  async createAccount(financialAccount: FinancialAccountCreateDTO) {
    const financialAccountEntity = plainToInstance(
      FinancialAccount,
      financialAccount,
    );

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
}
