import { ApiProperty } from '@nestjs/swagger';

export class InternalServerErrorDocsDTO {
  @ApiProperty({
    description: 'Error code',
    type: String,
    required: true,
    example: '0001',
  })
  errorCode: string;

  @ApiProperty({
    description: 'Internal server error',
    type: String,
    required: true,
    example: 'Internal server error',
  })
  description: string;
}

export class EntityAlreadyExistsDocsDTO {
  @ApiProperty({
    description: 'Error code',
    type: String,
    required: true,
    example: '0002',
  })
  errorCode: string;

  @ApiProperty({
    description: 'Description',
    type: String,
    required: true,
    example: 'The entity already exists',
  })
  description: string;
}

export class CreditCardDoesntBelongToAccountDocsDTO {
  @ApiProperty({
    description: 'Error code',
    type: String,
    required: true,
    example: '0003',
  })
  errorCode: string;

  @ApiProperty({
    description: 'Description',
    type: String,
    required: true,
    example: 'Credit card doesn`t belong to user',
  })
  description: string;
}

export class UserNotAuthorizedDocsDTO {
  @ApiProperty({
    description: 'Error code',
    type: String,
    required: true,
    example: '0005',
  })
  errorCode: string;

  @ApiProperty({
    description: 'Description',
    type: String,
    required: true,
    example: 'Unauthorized',
  })
  description: string;
}

export class FinancialAccountDoesntBelongToUserDocsDTO {
  @ApiProperty({
    description: 'Error code',
    type: String,
    required: true,
    example: '0006',
  })
  errorCode: string;

  @ApiProperty({
    description: 'Description',
    type: String,
    required: true,
    example: 'Financial account doesn`t belong to user',
  })
  description: string;
}

export class UserNotExistsDocsDTO {
  @ApiProperty({
    description: 'Error code',
    type: String,
    required: true,
    example: '0007',
  })
  errorCode: string;

  @ApiProperty({
    description: 'Description',
    type: String,
    required: true,
    example: 'User doesn`t exists',
  })
  description: string;
}
