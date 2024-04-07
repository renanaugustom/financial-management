import { mock } from 'jest-mock-extended';
import { faker } from '@faker-js/faker';
import { Repository } from 'typeorm';

import { CategoryService } from '@src/category/category.service';
import { CategoryListDTO } from '@src/category/dtos/category-list.dto';
import { Category } from '@src/category/category.entity';

describe('CategoryService', () => {
  let categoryService: CategoryService;

  const categoryRepositoryMock = mock<Repository<Category>>();

  beforeEach(async () => {
    categoryService = new CategoryService(categoryRepositoryMock);
  });

  describe('listAll', () => {
    it('should return successfully"', async () => {
      // ARRANGE
      const categoryList: Array<Category> = [
        {
          id: faker.string.uuid(),
          name: 'Clothes',
          createdAt: new Date(),
          updatedAt: new Date(),
          transactions: [],
        },
        {
          id: faker.string.uuid(),
          name: 'Pet',
          createdAt: new Date(),
          updatedAt: new Date(),
          transactions: [],
        },
        {
          id: faker.string.uuid(),
          name: 'Health',
          createdAt: new Date(),
          updatedAt: new Date(),
          transactions: [],
        },
      ];

      const expectedResult: Array<CategoryListDTO> = [
        {
          id: categoryList[0].id,
          name: 'Clothes',
        },
        {
          id: categoryList[1].id,
          name: 'Pet',
        },
        {
          id: categoryList[2].id,
          name: 'Health',
        },
      ];

      categoryRepositoryMock.find.mockResolvedValue(categoryList);

      // ACT
      const result = await categoryService.listAll();

      // ASSERT
      expect(result).toEqual(expectedResult);
    });

    it('should throw if an error occurs', async () => {
      // ARRANGE
      const expectedError = new Error('any error');

      categoryRepositoryMock.find.mockRejectedValue(expectedError);

      // ACT
      const promise = categoryService.listAll();

      // ASSERT
      await expect(promise).rejects.toThrow(expectedError);
    });
  });
});
