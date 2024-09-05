import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreditCardCreateDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  brand: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  limit: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  financialAccountId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  invoiceDay: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  paymentDay: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  expirationDate: string;
}
