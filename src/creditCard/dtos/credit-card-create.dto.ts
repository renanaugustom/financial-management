import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreditCardCreateDTO {
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  brand: string;

  @IsNotEmpty()
  @IsNumber()
  limit: number;

  @IsNotEmpty()
  @IsString()
  financialAccountId: string;

  @IsNotEmpty()
  @IsNumber()
  invoiceDay: number;

  @IsNotEmpty()
  @IsNumber()
  paymentDay: number;

  @IsNotEmpty()
  @IsNumber()
  balance: number;
}
