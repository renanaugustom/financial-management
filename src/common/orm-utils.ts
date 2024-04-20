import {
  Between,
  FindOperator,
  LessThanOrEqual,
  MoreThanOrEqual,
} from 'typeorm';

export class ORMUtils {
  public filterByStartAndEndDate(
    startDate?: Date,
    endDate?: Date,
  ): FindOperator<Date> {
    const formattedStartDate = startDate
      ? new Date(startDate.toISOString().split('T')[0])
      : null;

    const formattedEndDate = endDate
      ? new Date(new Date(endDate).setHours(23, 59, 59, 999))
      : null;

    if (!startDate && !endDate) return;

    if (startDate && !endDate) return MoreThanOrEqual(formattedStartDate);

    if (!startDate && endDate) return LessThanOrEqual(formattedEndDate);

    return Between(formattedStartDate, formattedEndDate);
  }
}
