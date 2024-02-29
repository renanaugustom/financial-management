import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { defaultOptions } from '../ormconfig';
import { AppController } from './app.controller';

import { UserModule } from 'user/user.module';
import { FinancialAccountModule } from 'financialAccount/financial-account.module';

import { HttpExceptionFilter } from 'expceptions/exception.filter';
import { TransactionModule } from 'transaction/transaction.module';
import { CategoryModule } from 'category/category.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(defaultOptions),
    UserModule,
    FinancialAccountModule,
    TransactionModule,
    CategoryModule,
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
