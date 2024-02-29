import { Expose } from 'class-transformer';

export class CategoryListDTO {
  @Expose()
  id: string;

  @Expose()
  name: string;
}
