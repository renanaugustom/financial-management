import { ORMUtils } from '../orm-utils';
import { FindOperator } from 'typeorm';

describe('ORMUtils', () => {
  let ormUtils: ORMUtils;

  beforeEach(() => {
    ormUtils = new ORMUtils();
  });

  describe('filterByStartAndEndDate', () => {
    it('should return a FindOperator with Between condition when both startDate and endDate are provided', () => {
      // ARRANGE
      const startDate = new Date('2022-01-01');
      const endDate = new Date('2022-01-31T00:00:00-03:00');
      const expectedEndDate = new Date(endDate.setHours(23, 59, 59, 999));

      // ACT
      const result = ormUtils.filterByStartAndEndDate(startDate, endDate);

      // ASSERT
      expect(result).toBeInstanceOf(FindOperator);
      expect(result.type).toBe('between');
      expect(result.value).toEqual([startDate, expectedEndDate]);
    });

    it('should return a FindOperator with MoreThanOrEqual condition when only startDate is provided', () => {
      // ARRANGE
      const startDate = new Date('2022-01-01');

      // ACT
      const result = ormUtils.filterByStartAndEndDate(startDate);

      // ASSERT
      expect(result).toBeInstanceOf(FindOperator);
      expect(result.type).toBe('moreThanOrEqual');
      expect(result.value).toEqual(startDate);
    });

    it('should return a FindOperator with LessThanOrEqual condition when only endDate is provided', () => {
      // ARRANGE
      const endDate = new Date('2022-01-31T00:00:00-03:00');
      const expectedEndDate = new Date(endDate.setHours(23, 59, 59, 999));

      // ACT
      const result = ormUtils.filterByStartAndEndDate(undefined, endDate);

      // ASSERT
      expect(result).toBeInstanceOf(FindOperator);
      expect(result.type).toBe('lessThanOrEqual');
      expect(result.value).toEqual(expectedEndDate);
    });

    it('should return undefined when neither startDate nor endDate are provided', () => {
      // ACT
      const result = ormUtils.filterByStartAndEndDate();

      // ASSERT
      expect(result).toBeUndefined();
    });
  });
});
