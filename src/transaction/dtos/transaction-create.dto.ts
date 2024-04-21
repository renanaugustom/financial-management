import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class TransactionCreateDTO {
  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsNumber()
  value: number;

  @IsNotEmpty()
  @IsDateString()
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
