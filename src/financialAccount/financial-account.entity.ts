import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '@src/user/user.entity';
import { Transaction } from '@src/transaction/transaction.entity';
import { CreditCard } from '@src/creditCard/credit-card.entity';

@Entity('financial_account')
export class FinancialAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  type: string;

  @Column({ default: 0, nullable: false })
  balance: number;

  @Column({ name: 'user_id', nullable: false })
  userId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.accounts)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @OneToMany(() => Transaction, (transaction) => transaction.financialAccount)
  transactions: Transaction[];

  @OneToMany(() => CreditCard, (creditCard) => creditCard.financialAccount)
  creditCards: CreditCard[];
}
