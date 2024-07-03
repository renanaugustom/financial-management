import { Expose } from 'class-transformer';

export class CreditCardGetDto {
  @Expose()
  id: string;

  @Expose()
  description: string;

  @Expose()
  brand: string;

  @Expose()
  limit: number;

  @Expose()
  financialAccountId: string;

  @Expose()
  invoiceDay: number;

  @Expose()
  paymentDay: number;
}
