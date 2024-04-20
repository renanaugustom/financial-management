import { start } from 'repl';
import {
  Between,
  FindOperator,
  LessThanOrEqual,
  MoreThanOrEqual,
} from 'typeorm';

export class ORMUtils {
  public filterByStartAndEndDate(
    startDate?: string | Date,
    endDate?: Date,
  ): FindOperator<Date> {
    if (!startDate && !endDate) return;

    const formattedStartDate = startDate
      ? new Date(new Date(startDate).setHours(0, 0, 0))
      : null;

    const formattedEndDate = endDate
      ? new Date(new Date(endDate).setHours(23, 59, 59, 999))
      : null;

    if (startDate && !endDate) return MoreThanOrEqual(formattedStartDate);

    if (!startDate && endDate) return LessThanOrEqual(formattedEndDate);

    return Between(formattedStartDate, formattedEndDate);
  }
}
