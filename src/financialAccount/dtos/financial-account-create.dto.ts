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
}
