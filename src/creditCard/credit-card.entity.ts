import { FinancialAccount } from '@src/financialAccount/financial-account.entity';
import { Transaction } from '@src/transaction/transaction.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('credit_card')
export class CreditCard {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  description: string;

  @Column({ nullable: false })
  brand: string;

  @Column({ default: 0, nullable: false })
  limit: number;

  @Column({ name: 'financial_account_id', nullable: false })
  financialAccountId: string;

  @Column({ name: 'invoice_day', nullable: false })
  invoiceDay: number;

  @Column({ name: 'payment_day', nullable: false })
  paymentDay: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(
    () => FinancialAccount,
    (financialAccount) => financialAccount.creditCards,
  )
  @JoinColumn({ name: 'financial_account_id', referencedColumnName: 'id' })
  financialAccount: FinancialAccount;

  @OneToMany(() => Transaction, (transaction) => transaction.creditCard)
  transactions: Transaction[];
}
