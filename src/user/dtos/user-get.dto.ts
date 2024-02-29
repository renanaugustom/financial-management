import { Expose } from 'class-transformer';

export class UserGetDTO {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  email: string;
}
