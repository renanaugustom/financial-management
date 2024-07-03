import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';

import { CreditCardService } from '@src/creditCard/credit-card.service';
import { CreditCardCreateDTO } from '@src/creditCard/dtos/credit-card-create.dto';
import { UserContextDTO } from '@src/auth/dtos/user-contexto.dto';

@Controller('credit-card')
export class CreditCardController {
  constructor(private creditCardService: CreditCardService) {}

  @Post('/')
  @ApiOperation({
    summary: 'Create a new credit card',
    tags: ['Credit Card'],
  })
  @ApiCreatedResponse()
  async create(
    @Req() request: Request,
    @Body() newCreditCard: CreditCardCreateDTO,
  ): Promise<void> {
    const user = request['user'] as UserContextDTO;

    await this.creditCardService.createCreditCard(user.sub, newCreditCard);
  }
}
