import { ApiProperty } from '@nestjs/swagger';

export class UserCreateDTO {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}
