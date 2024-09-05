import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class FinancialAccountDTO {
  @ApiProperty({
    description: 'Financial account ID',
    type: 'string',
    example: '7e6c9b8e-1d4d-4f0e-8f6f-0b6b2b5c0d7f',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Financial account name',
    type: 'string',
    example: 'My Wallet',
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: 'Financial account type',
    example: 'wallet',
    type: 'string',
    enum: ['saving', 'wallet', 'checking', 'payment'],
  })
  @Expose()
  type: string;

  @ApiProperty({
    description: 'Financial account balance',
    type: 'number',
    example: 100.0,
  })
  @Expose()
  balance: number;

  @ApiProperty({
    description: 'User ID',
    type: 'string',
    example: '7e6c9b8e-1d4d-4f0e-8f6f-0b6b2b5c0d7f',
  })
  @Expose()
  userId: string;
}

export class FinancialAccountListDTO {
  @ApiProperty({
    description: 'Total Balance',
    type: 'string',
    example: '7e6c9b8e-1d4d-4f0e-8f6f-0b6b2b5c0d7f',
  })
  accountsTotalBalance: number;

  @ApiProperty({
    description: 'List of financial accounts',
    type: FinancialAccountDTO,
    isArray: true,
  })
  @Expose()
  @Type(() => FinancialAccountDTO)
  accounts: FinancialAccountDTO[];
}
