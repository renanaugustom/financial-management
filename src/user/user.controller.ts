import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
} from '@nestjs/swagger';

import { UserService } from '@src/user/user.service';
import { UserCreateDTO } from '@src/user/dtos/user-create.dto';
import { Public } from '@src/auth/auth.guard';
import {
  EntityAlreadyExistsDocsDTO,
  InternalServerErrorDocsDTO,
} from '@src/docs/dtos/docs.dto';

@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/user')
  @ApiOperation({
    summary: 'Create a new user',
    tags: ['User'],
  })
  @ApiCreatedResponse()
  @ApiConflictResponse({
    description: 'User already exists',
    type: EntityAlreadyExistsDocsDTO,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    type: InternalServerErrorDocsDTO,
  })
  @Public()
  async create(@Body() newUser: UserCreateDTO): Promise<void> {
    await this.userService.createUser(newUser);
  }
}
