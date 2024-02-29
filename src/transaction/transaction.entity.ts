import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { FinancialAccount } from 'financialAccount/financial-account.entity';
import { Category } from 'category/category.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  type: string;

  @Column({ nullable: false })
  value: number;

  @Column({ nullable: false })
  date: Date;

  @Column({ name: 'financial_account_id' })
  financialAccountId: string;

  @Column({ name: 'category_id' })
  categoryId: string;

  @ManyToOne(() => FinancialAccount, (account) => account.transactions)
  @JoinColumn({ name: 'financial_account_id', referencedColumnName: 'id' })
  account: FinancialAccount;

  @ManyToOne(() => Category, (category) => category.transactions)
  @JoinColumn({ name: 'category_id', referencedColumnName: 'id' })
  category: Category;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
