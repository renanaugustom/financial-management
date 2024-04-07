import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';

import { FinancialAccount } from '@src/financialAccount/financial-account.entity';
import { FinancialAccountCreateDTO } from '@src/financialAccount/dtos/financial-account-create.dto';

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

    await this.accountRepository.save(financialAccountEntity);
  }
}
