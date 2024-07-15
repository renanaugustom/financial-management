import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CreditCardGetDto {
  @Expose()
  @ApiProperty({
    description: 'Credit card ID',
    type: String,
    required: true,
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
  })
  id: string;

  @Expose()
  @ApiProperty({
    description: 'Credit card description',
    type: String,
    required: true,
    example: 'Mastercard Black',
  })
  description: string;

  @Expose()
  @ApiProperty({
    description: 'Brand description',
    type: String,
    required: true,
    example: 'Mastercard',
  })
  brand: string;

  @Expose()
  @ApiProperty({
    description: 'Credit card limit',
    type: Number,
    required: true,
    example: 1000,
  })
  limit: number;

  @Expose()
  @ApiProperty({
    description: 'Financial Account ID',
    type: String,
    required: true,
    example: '2a5f1ee-6c54-4b01-90e6-d701748f0851',
  })
  financialAccountId: string;

  @Expose()
  @ApiProperty({
    description: 'Invoice day',
    type: Number,
    required: true,
    example: 5,
  })
  invoiceDay: number;

  @Expose()
  @ApiProperty({
    description: 'Payment day',
    type: Number,
    required: true,
    example: 12,
  })
  paymentDay: number;
}
