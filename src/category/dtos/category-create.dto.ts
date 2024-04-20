import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CategoryCreateDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Category name',
    type: String,
    required: true,
    example: 'Health',
  })
  name: string;
}
