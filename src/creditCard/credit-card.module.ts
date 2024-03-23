import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreditCard } from 'creditCard/credit-card.entity';
import { CreditCardService } from 'creditCard/credit-card.service'
import { CreditCardController } from 'creditCard/credit-card.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CreditCard])],
  providers: [CreditCardService],
  controllers: [CreditCardController],
  exports: [CreditCardService],
})
export class CreditCardModule {}
