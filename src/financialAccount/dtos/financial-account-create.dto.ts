import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class FinancialAccountCreateDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsNumber()
  balance: number;

  @IsNotEmpty()
  @IsString()
  userId: string;
}
