import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';

import { plainToInstance } from 'class-transformer';

import { CATALOG_ERRORS } from '@src/exceptions/catalog-errors';
import { UserCreateDTO } from '@src/user/dtos/user-create.dto';
import { User } from '@src/user/user.entity';
import { UtilsService } from '@src/common/utils.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private _userRepository: Repository<User>,
    private _utilsService: UtilsService,
  ) {}

  async createUser(user: UserCreateDTO) {
    try {
      user.password = await this._utilsService.hashString(user.password);

      const userEntity = plainToInstance(User, user);

      await this._userRepository.save(userEntity);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        if (error.driverError.code === '23505') {
          throw CATALOG_ERRORS.DB_DUPLICATED_ERROR('user');
        }
      }

      throw error;
    }
  }
}
