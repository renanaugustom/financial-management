import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class FinancialAccountCreateDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Name of the financial account',
    example: 'My account',
  })
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Type of the financial account',
    example: 'Checking Account',
  })
  type: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'Balance of the financial account',
    example: 1000,
  })
  balance: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'User ID',
    example: 'c5e4f3d2-b1a9-4b3c-8d7e-6f5a4b3c2d1a',
  })
  userId: string;
}
