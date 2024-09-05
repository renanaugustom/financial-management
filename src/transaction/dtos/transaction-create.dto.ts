import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    description: 'Transaction type',
    example: 'DEBIT',
  })
  type: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'Transaction value',
    example: 100,
  })
  value: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Transaction description',
    example: 'Remedy',
  })
  description: string;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({
    description: 'Transaction date',
    example: '2021-01-01',
  })
  date: Date;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Financial account ID',
    example: 'c5e4f3d2-b1a9-4b3c-8d7e-6f5a4b3c2d1a',
  })
  financialAccountId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Category ID',
    example: 'd4c3b2a1-9a1b-3c4b-7d8e-5a4b3c2d1a6f',
  })
  categoryId: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Credit card ID',
    example: 'e6f5a4b3-c2d1-a9b1-4b3c-8d7e-5a4b3c2d1a',
  })
  creditCardId?: string;
}
