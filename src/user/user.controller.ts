import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';

import { UserService } from 'user/user.service';
import { UserCreateDTO } from 'user/dtos/user-create.dto';

@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/user')
  @ApiOperation({
    summary: 'Create a new user',
    tags: ['User'],
  })
  @ApiCreatedResponse()
  async create(@Body() newUser: UserCreateDTO): Promise<void> {
    await this.userService.createUser(newUser);
  }
}
