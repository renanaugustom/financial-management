import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { defaultOptions } from '../ormconfig';
import { AppController } from './app.controller';

import { UserModule } from '@src/user/user.module';
import { FinancialAccountModule } from '@src/financialAccount/financial-account.module';
import { HttpExceptionFilter } from '@src/exceptions/exception.filter';
import { TransactionModule } from '@src/transaction/transaction.module';
import { CategoryModule } from '@src/category/category.module';
import { CreditCardModule } from '@src/creditCard/credit-card.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(defaultOptions),
    UserModule,
    FinancialAccountModule,
    TransactionModule,
    CategoryModule,
    CreditCardModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
