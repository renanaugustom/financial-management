import { mock } from 'jest-mock-extended';
import { faker } from '@faker-js/faker';

import { CategoryController } from '@src/category/category.controller';
import { CategoryService } from '@src/category/category.service';
import { CategoryListDTO } from '@src/category/dtos/category-list.dto';
import { CATALOG_ERRORS } from '@src/exceptions/catalog-errors';

describe('CategoryController', () => {
  let categoryController: CategoryController;

  const categoryServiceMock = mock<CategoryService>();

  beforeEach(async () => {
    categoryController = new CategoryController(categoryServiceMock);
  });

  describe('listAll', () => {
    it('should return successfully"', async () => {
      // ARRANGE
      const categoryListResult: Array<CategoryListDTO> = [
        { id: faker.string.uuid(), name: 'Clothes' },
        { id: faker.string.uuid(), name: 'Pet' },
        { id: faker.string.uuid(), name: 'Health' },
      ];

      categoryServiceMock.listAll.mockResolvedValue(categoryListResult);

      // ACT
      const result = await categoryController.listAll();

      // ASSERT
      expect(result).toEqual(categoryListResult);
    });

    it('should throw exception if listAll fails"', async () => {
      // ARRANGE
      const expectedError = CATALOG_ERRORS.SERVER_ERROR;

      categoryServiceMock.listAll.mockRejectedValue(expectedError);

      // ACT
      const promise = categoryController.listAll();

      // ASSERT
      await expect(promise).rejects.toThrow(expectedError);
    });
  });
});
