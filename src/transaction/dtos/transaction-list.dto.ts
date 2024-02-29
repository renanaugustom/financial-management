import { Expose, Transform } from 'class-transformer';

export class TransactionListDTO {
  @Expose()
  value: string;

  @Expose()
  date: Date;

  @Expose()
  type: string;

  @Expose()
  @Transform((value) => {
    if (value.obj['account']) {
      return value.obj['account']['id'];
    }
  })
  financialAccountId: string;

  @Expose()
  @Transform((value) => {
    if (value.obj['account']) {
      return value.obj['account']['name'];
    }
  })
  financialAccountName: string;

  @Expose()
  @Transform((value) => {
    if (value.obj['category']) {
      return value.obj['category']['id'];
    }
  })
  categoryId: string;

  @Expose()
  @Transform((value) => {
    if (value.obj['category']) {
      return value.obj['category']['name'];
    }
  })
  categoryName: string;
}
