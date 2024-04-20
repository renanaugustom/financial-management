import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CategoryListDTO {
  @Expose()
  @ApiProperty({
    description: 'Category ID',
    type: String,
    required: true,
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
  })
  id: string;

  @Expose()
  @ApiProperty({
    description: 'Category name',
    type: String,
    required: true,
    example: 'Health',
  })
  name: string;
}
