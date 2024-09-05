import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEmpty, IsString } from 'class-validator';

export class TransactionFilterDTO {
  @IsEmpty()
  @IsDate()
  @ApiProperty({
    required: false,
    description: 'Start date of the transaction',
    example: '2021-07-01',
  })
  public startDate?: Date;

  @IsDate()
  @IsEmpty()
  @ApiProperty({
    required: false,
    description: 'End date of the transaction',
    example: '2021-08-01',
  })
  public endDate?: Date;

  @IsString()
  @IsEmpty()
  @ApiProperty({
    required: false,
    description: 'Financial account ID',
    example: '5f4b3b3b-1b7b-4b3b-8b3b-1b7b4b3b8b3b',
  })
  public financialAccountId?: string;

  @IsString()
  @IsEmpty()
  @ApiProperty({
    required: false,
    description: 'Category ID',
    example: '5f4b3b3b-1b7b-4b3b-8b3b-1b7b4b3b8b3b',
  })
  public categoryId?: string;

  @IsString()
  @IsEmpty()
  @ApiProperty({
    required: false,
    description: 'Type of transaction',
    example: 'CREDIT',
  })
  public type?: string;
}
