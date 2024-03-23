import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FinancialAccount } from 'financialAccount/financial-account.entity';
import { FinancialAccountCreateDTO } from 'financialAccount/dtos/financial-account-create.dto';
import { plainToInstance } from 'class-transformer';
import { CATALOG_ERRORS } from 'expceptions/catalog-errors';

@Injectable()
export class FinancialAccountService {
  constructor(
    @InjectRepository(FinancialAccount)
    private accountRepository: Repository<FinancialAccount>,
  ) {}

  async createAccount(
    financialAccount: FinancialAccountCreateDTO,
  ): Promise<FinancialAccount> {
    try {
      const financialAccountEntity = plainToInstance(
        FinancialAccount,
        financialAccount,
      );

      return await this.accountRepository.save(financialAccountEntity);
    } catch (error) {
      console.log(error);
      throw CATALOG_ERRORS.SERVER_ERROR;
    }
  }
}
