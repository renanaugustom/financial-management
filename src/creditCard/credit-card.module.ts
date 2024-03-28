import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreditCard } from '@src/creditCard/credit-card.entity';
import { CreditCardService } from '@src/creditCard/credit-card.service'
import { CreditCardController } from '@src/creditCard/credit-card.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CreditCard])],
  providers: [CreditCardService],
  controllers: [CreditCardController],
  exports: [CreditCardService],
})
export class CreditCardModule {}
