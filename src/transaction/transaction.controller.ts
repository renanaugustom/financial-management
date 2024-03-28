import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

import { TransactionService } from '@src/transaction/transaction.service';
import { TransactionCreateDTO } from '@src/transaction/dtos/transaction-create.dto';
import { TransactionListDTO } from '@src/transaction/dtos/transaction-list.dto';
import { TransactionFilterDTO } from '@src/transaction/dtos/transaction-filter.dto';

@Controller('transaction')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Post('/')
  @ApiOperation({
    summary: 'Create a new transaction',
    tags: ['Transaction'],
  })
  @ApiCreatedResponse()
  async create(@Body() newTransaction: TransactionCreateDTO): Promise<void> {
    await this.transactionService.createTransaction(newTransaction);
  }

  @Get(':userId/filter')
  @ApiOperation({
    summary: 'List transactions by user ID',
    tags: ['Transaction'],
  })
  @ApiOkResponse({
    description: 'Filter transactions by user ID',
  })
  async filterByUser(
    @Param('userId') userId: string,
    @Query('type') type?: string,
    @Query('startDate') startDate?: Date,
    @Query('endDate') endDate?: Date,
    @Query('financialAccountId') financialAccountId?: string,
    @Query('categoryId') categoryId?: string,
  ): Promise<Array<TransactionListDTO>> {
    const filter = new TransactionFilterDTO(
      startDate,
      endDate,
      financialAccountId,
      categoryId,
      type,
    );

    return await this.transactionService.listByUserId(userId, filter);
  }

  @Get(':userId/credit-card/:creditCardId')
  @ApiOperation({
    summary: 'List transactions by user ID and credit card ID',
    tags: ['Transaction'],
  })
  @ApiOkResponse({
    description: 'Filter transactions by user ID and credit card ID',
  })
  async filterByCreditCard(
    @Param('userId') userId: string,
    @Param('creditCardId') creditCardId: string,
  ): Promise<Array<TransactionListDTO>> {
    return await this.transactionService.listByUserAndCreditCard(
      userId,
      creditCardId,
    );
  }
}
