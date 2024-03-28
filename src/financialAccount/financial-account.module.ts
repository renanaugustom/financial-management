import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinancialAccount } from '@src/financialAccount/financial-account.entity';
import { FinancialAccountController } from '@src/financialAccount/financial-account.controller';
import { FinancialAccountService } from '@src/financialAccount/financial-account.service';

@Module({
  imports: [TypeOrmModule.forFeature([FinancialAccount])],
  providers: [FinancialAccountService],
  controllers: [FinancialAccountController],
  exports: [FinancialAccountService],
})
export class FinancialAccountModule {}
