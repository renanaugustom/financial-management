import { compare } from 'bcrypt';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';

import { User } from '@src/user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CATALOG_ERRORS } from '@src/exceptions/catalog-errors';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async signIn(email: string, pass: string): Promise<any> {
    const user = await this.userRepository.findOneBy({ email });

    if (!user || !(await compare(pass, user.password))) {
      throw CATALOG_ERRORS.USER_NOT_AUTHORIZED;
    }

    const { name } = user;

    const payload = { sub: user.id, username: name };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
