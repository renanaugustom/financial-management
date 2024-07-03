import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreditCard } from '@src/creditCard/credit-card.entity';
import { CreditCardService } from '@src/creditCard/credit-card.service';
import { CreditCardController } from '@src/creditCard/credit-card.controller';
import { FinancialAccount } from '@src/financialAccount/financial-account.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CreditCard]),
    TypeOrmModule.forFeature([FinancialAccount]),
  ],
  providers: [CreditCardService],
  controllers: [CreditCardController],
  exports: [CreditCardService],
})
export class CreditCardModule {}
