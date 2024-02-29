import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';

import { plainToInstance } from 'class-transformer';

import { CATALOG_ERRORS } from 'expceptions/catalog-errors';
import { UserCreateDTO } from 'user/dtos/user-create.dto';
import { User } from 'user/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(user: UserCreateDTO): Promise<User> {
    try {
      const userEntity = plainToInstance(User, user);
      return await this.userRepository.save(userEntity);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        if (error.driverError.code === '23505') {
          throw CATALOG_ERRORS.DB_DUPLICATED_ERROR('user');
        }
      }

      throw CATALOG_ERRORS.SERVER_ERROR;
    }
  }
}
