import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionService } from 'transaction/transaction.service';
import { Transaction } from 'transaction/transaction.entity';
import { TransactionController } from 'transaction/transaction.controller';
import { CreditCardModule } from 'creditCard/credit-card.module';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction]), CreditCardModule],
  providers: [TransactionService],
  controllers: [TransactionController],
  exports: [TransactionService],
})
export class TransactionModule {}
