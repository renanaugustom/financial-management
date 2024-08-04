import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';

import { AuthService } from '@src/auth/auth.service';
import { LoginDTO } from '@src/auth/dtos/login.dto';
import { LoginResponseDTO } from '@src/auth/dtos/login-response.dto';
import { Public } from '@src/auth/auth.guard';
import {
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  InternalServerErrorDocsDTO,
  UserNotAuthorizedDocsDTO,
} from '@src/docs/dtos/docs.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({
    summary: 'Login',
    tags: ['Auth'],
  })
  @ApiOkResponse({
    description: 'User logged in',
    type: LoginResponseDTO,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: UserNotAuthorizedDocsDTO,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    type: InternalServerErrorDocsDTO,
  })
  @HttpCode(HttpStatus.OK)
  @Public()
  async login(@Body() loginDto: LoginDTO): Promise<LoginResponseDTO> {
    return await this.authService.signIn(loginDto.email, loginDto.password);
  }
}
