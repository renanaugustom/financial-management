import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { defaultOptions } from '../ormconfig';
import { AppController } from './app.controller';

import { UserModule } from '@src/user/user.module';
import { FinancialAccountModule } from '@src/financialAccount/financial-account.module';
import { HttpExceptionFilter } from '@src/exceptions/exception.filter';
import { TransactionModule } from '@src/transaction/transaction.module';
import { CategoryModule } from '@src/category/category.module';
import { CreditCardModule } from '@src/creditCard/credit-card.module';
import { AuthModule } from '@src/auth/auth.module';
import { AuthGuard } from '@src/auth/auth.guard';
import { RolesGuard } from './auth/roles/roles.guard';

@Module({
  imports: [
    TypeOrmModule.forRoot(defaultOptions),
    UserModule,
    FinancialAccountModule,
    TransactionModule,
    CategoryModule,
    CreditCardModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
