import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class TransactionListDTO {
  @Expose()
  @ApiProperty({
    type: String,
    description: 'Transaction Amount',
    example: 5000,
  })
  value: number;

  @Expose()
  @ApiProperty({
    type: Date,
    description: 'Transaction Date',
    example: '2021-10-10T00:00:00.000Z',
  })
  date: Date;

  @Expose()
  @ApiProperty({
    type: String,
    description: 'Transaction Type',
    example: 'CREDIT',
  })
  type: string;

  @Expose()
  @ApiProperty({
    type: String,
    description: 'Transaction Description',
    example: 'Salary',
  })
  description: string;

  @Expose()
  @Transform((value) => {
    if (value.obj['financialAccount']) {
      return value.obj['financialAccount']['id'];
    }
  })
  @ApiProperty({
    type: String,
    description: 'Financial Account ID',
    example: 'c1e5c4b7-4d2f-4c3d-9c7f-0e3b0f8b8d4f',
  })
  financialAccountId: string;

  @Expose()
  @Transform((value) => {
    if (value.obj['financialAccount']) {
      return value.obj['financialAccount']['name'];
    }
  })
  @ApiProperty({
    type: String,
    description: 'Financial Account Name',
    example: 'Nubank',
  })
  financialAccountName: string;

  @Expose()
  @Transform((value) => {
    if (value.obj['category']) {
      return value.obj['category']['id'];
    }
  })
  @ApiProperty({
    type: String,
    description: 'Category ID',
    example: 'c1e5c4b7-4d2f-4c3d-9c7f-0e3b0f8b8d4f',
  })
  categoryId: string;

  @Expose()
  @Transform((value) => {
    if (value.obj['category']) {
      return value.obj['category']['name'];
    }
  })
  @ApiProperty({
    type: String,
    description: 'Category Name',
    example: 'Health',
  })
  categoryName: string;
}
