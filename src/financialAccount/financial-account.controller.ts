import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { Request } from 'express';

import { FinancialAccountService } from '@src/financialAccount/financial-account.service';
import { FinancialAccountCreateDTO } from '@src/financialAccount/dtos/financial-account-create.dto';
import { FinancialAccount } from '@src/financialAccount/financial-account.entity';
import { UserContextDTO } from '@src/auth/dtos/user-contexto.dto';
import { FinancialAccountListDTO } from '@src/financialAccount/dtos/financial-account-list.dto';
import {
  InternalServerErrorDocsDTO,
  UserNotExistsDocsDTO,
} from '@src/docs/dtos/docs.dto';

@Controller('financial-account')
export class FinancialAccountController {
  constructor(private financialAccountService: FinancialAccountService) {}

  @Post('/')
  @ApiOperation({
    summary: 'Create a new financial account',
    tags: ['Financial Account'],
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    type: UserNotExistsDocsDTO,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    type: InternalServerErrorDocsDTO,
  })
  @ApiCreatedResponse({
    description: 'Financial account created',
  })
  async create(
    @Body() newFinancialAccount: FinancialAccountCreateDTO,
  ): Promise<void> {
    await this.financialAccountService.createAccount(newFinancialAccount);
  }

  @Get('/')
  @ApiOperation({
    summary: 'Get financial accounts by user ID',
    tags: ['Financial Account'],
  })
  @ApiOkResponse({ type: [FinancialAccountListDTO] })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    type: InternalServerErrorDocsDTO,
  })
  async listByUserId(
    @Req() request: Request,
  ): Promise<FinancialAccountListDTO[]> {
    const user = request['user'] as UserContextDTO;

    return this.financialAccountService.listByUserId(user.sub);
  }
}
