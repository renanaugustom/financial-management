export class CreditCardGetDto {
  id: string;
  description: string;
  brand: string;
  limit: number;
  financialAccountId: string;
  invoiceDay: number;
  paymentDay: number;
}
