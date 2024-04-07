import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionService } from '@src/transaction/transaction.service';
import { Transaction } from '@src/transaction/transaction.entity';
import { TransactionController } from '@src/transaction/transaction.controller';
import { CreditCard } from '@src/creditCard/credit-card.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    TypeOrmModule.forFeature([CreditCard]),
  ],
  providers: [TransactionService],
  controllers: [TransactionController],
  exports: [TransactionService],
})
export class TransactionModule {}
