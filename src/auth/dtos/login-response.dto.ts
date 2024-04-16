import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginResponseDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  accessToken: string;
}
