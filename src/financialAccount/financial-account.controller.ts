import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';

import { FinancialAccountService } from '@src/financialAccount/financial-account.service';
import { FinancialAccountCreateDTO } from '@src/financialAccount/dtos/financial-account-create.dto';

@Controller('financial-account')
export class FinancialAccountController {
  constructor(private financialAccountService: FinancialAccountService) {}

  @Post('/')
  @ApiOperation({
    summary: 'Create a new financial account',
    tags: ['Financial Account'],
  })
  @ApiCreatedResponse()
  async create(
    @Body() newFinancialAccount: FinancialAccountCreateDTO,
  ): Promise<void> {
    await this.financialAccountService.createAccount(newFinancialAccount);
  }
}
