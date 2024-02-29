import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinancialAccount } from 'financialAccount/financial-account.entity';
import { FinancialAccountController } from 'financialAccount/financial-account.controller';
import { FinancialAccountService } from 'financialAccount/financial-account.service';

@Module({
  imports: [TypeOrmModule.forFeature([FinancialAccount])],
  providers: [FinancialAccountService],
  controllers: [FinancialAccountController],
  exports: [FinancialAccountService],
})
export class FinancialAccountModule {}
