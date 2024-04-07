import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';

import { plainToInstance } from 'class-transformer';

import { CATALOG_ERRORS } from '@src/exceptions/catalog-errors';
import { UserCreateDTO } from '@src/user/dtos/user-create.dto';
import { User } from '@src/user/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(user: UserCreateDTO) {
    try {
      const userEntity = plainToInstance(User, user);
      await this.userRepository.save(userEntity);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        console.log(error);
        if (error.driverError.code === '23505') {
          throw CATALOG_ERRORS.DB_DUPLICATED_ERROR('user');
        }
      }

      throw error;
    }
  }
}
