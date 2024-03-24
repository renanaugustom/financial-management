import { IsNotEmpty, IsDate, IsNumber, IsString, IsOptional } from 'class-validator';

export class TransactionCreateDTO {
  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsNumber()
  value: number;

  @IsNotEmpty()
  @IsDate()
  date: Date;

  @IsNotEmpty()
  @IsString()
  financialAccountId: string;

  @IsNotEmpty()
  @IsString()
  categoryId: string;

  @IsString()
  @IsOptional()
  creditCardId?: string;
}
