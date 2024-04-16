import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';

@Injectable()
export class UtilsService {
  public async hashString(input: string): Promise<string> {
    const saltRounds = 10;

    const salt = await bcrypt.genSaltSync(saltRounds);
    const hash = await bcrypt.hashSync(input, salt);

    return hash;
  }
}
