import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { Request } from 'express';

import { CreditCardService } from '@src/creditCard/credit-card.service';
import { CreditCardCreateDTO } from '@src/creditCard/dtos/credit-card-create.dto';
import { UserContextDTO } from '@src/auth/dtos/user-contexto.dto';
import { CreditCardGetDto } from './dtos/credit-card-get.dto';
import {
  FinancialAccountDoesntBelongToUserDocsDTO,
  InternalServerErrorDocsDTO,
} from '@src/docs/dtos/docs.dto';

@Controller('credit-card')
export class CreditCardController {
  constructor(private creditCardService: CreditCardService) {}

  @Post('/')
  @ApiOperation({
    summary: 'Create a new credit card',
    tags: ['Credit Card'],
  })
  @ApiInternalServerErrorResponse({
    type: InternalServerErrorDocsDTO,
  })
  @ApiCreatedResponse({
    description: 'Credit card created',
  })
  @ApiConflictResponse({
    type: FinancialAccountDoesntBelongToUserDocsDTO,
  })
  async create(
    @Req() request: Request,
    @Body() newCreditCard: CreditCardCreateDTO,
  ): Promise<void> {
    const user = request['user'] as UserContextDTO;

    await this.creditCardService.createCreditCard(user.sub, newCreditCard);
  }

  @Get('/')
  @ApiOperation({
    summary: 'Get credit cards from user',
    tags: ['Credit Card'],
  })
  @ApiOkResponse({
    description: 'List all categories',
    type: [CreditCardGetDto],
  })
  @ApiInternalServerErrorResponse({
    type: InternalServerErrorDocsDTO,
  })
  async listByUser(@Req() request: Request): Promise<CreditCardGetDto[]> {
    const user = request['user'] as UserContextDTO;

    return await this.creditCardService.listByUser(user.sub);
  }
}
