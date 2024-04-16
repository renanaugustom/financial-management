import { Controller, Post, Body } from '@nestjs/common';

import { AuthService } from '@src/auth/auth.service';
import { LoginDTO } from '@src/auth/dtos/login.dto';
import { LoginResponseDTO } from '@src/auth/dtos/login-response.dto';
import { Public } from '@src/auth/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  async login(@Body() loginDto: LoginDTO): Promise<LoginResponseDTO> {
    return await this.authService.signIn(loginDto.email, loginDto.password);
  }
}
