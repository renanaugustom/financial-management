import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

import { TransactionService } from '@src/transaction/transaction.service';
import { TransactionCreateDTO } from '@src/transaction/dtos/transaction-create.dto';
import { TransactionListDTO } from '@src/transaction/dtos/transaction-list.dto';
import { TransactionFilterDTO } from '@src/transaction/dtos/transaction-filter.dto';
import { UserContextDTO } from '@src/auth/dtos/user-contexto.dto';
import { Request } from 'express';
import {
  CategoryNotExistsDocsDTO,
  FinancialAccountDoesntBelongToUserDocsDTO,
  InternalServerErrorDocsDTO,
} from '@src/docs/dtos/docs.dto';

@Controller('transaction')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Post('/')
  @ApiOperation({
    summary: 'Create a new transaction',
    tags: ['Transaction'],
  })
  @ApiCreatedResponse({
    description: 'Transaction created',
  })
  @ApiNotFoundResponse({
    description: 'Category not found',
    type: CategoryNotExistsDocsDTO,
  })
  @ApiConflictResponse({
    description: 'Financial account does not belong to user',
    type: FinancialAccountDoesntBelongToUserDocsDTO,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    type: InternalServerErrorDocsDTO,
  })
  async create(
    @Req() request: Request,
    @Body() newTransaction: TransactionCreateDTO,
  ): Promise<void> {
    const user = request['user'] as UserContextDTO;

    await this.transactionService.createTransaction(user.sub, newTransaction);
  }

  @Get('/filter')
  @ApiOperation({
    summary: 'List user transactions',
    tags: ['Transaction'],
  })
  @ApiOkResponse({
    description: 'List transactions',
    type: [TransactionListDTO],
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    type: InternalServerErrorDocsDTO,
  })
  async filterByUser(
    @Req() request: Request,
    @Query('type') type?: string,
    @Query('startDate') startDate?: Date,
    @Query('endDate') endDate?: Date,
    @Query('financialAccountId') financialAccountId?: string,
    @Query('categoryId') categoryId?: string,
  ): Promise<Array<TransactionListDTO>> {
    const filter: TransactionFilterDTO = {
      startDate,
      endDate,
      financialAccountId,
      categoryId,
      type,
    };

    const user = request['user'] as UserContextDTO;

    return await this.transactionService.listByUserId(user.sub, filter);
  }

  @Get('/credit-card/:creditCardId')
  @ApiOperation({
    summary: 'List transactions by user ID and credit card ID',
    tags: ['Transaction'],
  })
  @ApiOkResponse({
    description: 'Filter transactions by user ID and credit card ID',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    type: InternalServerErrorDocsDTO,
  })
  async filterByCreditCard(
    @Req() request: Request,
    @Param('creditCardId') creditCardId: string,
  ): Promise<Array<TransactionListDTO>> {
    const user = request['user'] as UserContextDTO;

    return await this.transactionService.listByUserAndCreditCard(
      user.sub,
      creditCardId,
    );
  }
}
