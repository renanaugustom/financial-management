export class TransactionFilterDTO {
  constructor(
    public startDate?: Date,
    public endDate?: Date,
    public financialAccountId?: string,
    public categoryId?: string,
    public type?: string,
  ) {}
}
