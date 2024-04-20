import { compare } from 'bcrypt';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';

import { User } from '@src/user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CATALOG_ERRORS } from '@src/exceptions/catalog-errors';
import { Role } from '@src/auth/dtos/role.enum';
import { UserContextDTO } from '@src/auth/dtos/user-contexto.dto';

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

    const payload: UserContextDTO = {
      sub: user.id,
      userName: user.name,
      roles: this._buildRoles(user),
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  private _buildRoles(user: User) {
    let roles = [];

    user.isAdmin ? roles.push(Role.Admin) : roles.push(Role.User);

    return roles;
  }
}
