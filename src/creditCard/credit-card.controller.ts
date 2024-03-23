import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';

import { CreditCardService } from 'creditCard/credit-card.service';
import { CreditCardCreateDTO } from 'creditCard/dtos/credit-card-create.dto';

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
    @Body() newCreditCard: CreditCardCreateDTO,
  ): Promise<void> {
    await this.creditCardService.createCreditCard(newCreditCard);
  }
}
