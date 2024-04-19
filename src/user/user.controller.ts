import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';

import { UserService } from '@src/user/user.service';
import { UserCreateDTO } from '@src/user/dtos/user-create.dto';
import { Public } from '@src/auth/auth.guard';

@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/user')
  @ApiOperation({
    summary: 'Create a new user',
    tags: ['User'],
  })
  @ApiCreatedResponse()
  @Public()
  async create(@Body() newUser: UserCreateDTO): Promise<void> {
    await this.userService.createUser(newUser);
  }
}
