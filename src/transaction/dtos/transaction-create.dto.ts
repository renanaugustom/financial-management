export class TransactionCreateDTO {
  type: string;
  value: number;
  date: Date;
  financialAccountId: string;
  categoryId: string;
  creditCardId?: string;
}
