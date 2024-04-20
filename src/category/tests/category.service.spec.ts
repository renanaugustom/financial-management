import { mock } from 'jest-mock-extended';
import { faker } from '@faker-js/faker';
import { QueryFailedError, Repository } from 'typeorm';

import { CategoryService } from '@src/category/category.service';
import { CategoryListDTO } from '@src/category/dtos/category-list.dto';
import { Category } from '@src/category/category.entity';
import { plainToClass } from 'class-transformer';
import { CATALOG_ERRORS } from '@src/exceptions/catalog-errors';

describe('CategoryService', () => {
  let categoryService: CategoryService;

  const categoryRepositoryMock = mock<Repository<Category>>();

  const createCategoryDTO = {
    name: faker.string.sample(),
  };
  const categoryEntity = plainToClass(Category, createCategoryDTO);

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

  describe('createCategory', () => {
    it('should create successfully"', async () => {
      // ARRANGE
      categoryRepositoryMock.save.mockResolvedValue(categoryEntity);

      // ACT
      const result = await categoryService.createCategory(createCategoryDTO);

      // ASSERT
      expect(result).toBeUndefined();
      expect(categoryRepositoryMock.save).toHaveBeenCalledWith(categoryEntity);
    });

    it('should throw if an error occurs', async () => {
      // ARRANGE
      const expectedError = new Error('any error');

      categoryRepositoryMock.save.mockRejectedValue(expectedError);

      // ACT
      const promise = categoryService.createCategory(createCategoryDTO);

      // ASSERT
      await expect(promise).rejects.toThrow(expectedError);
      expect(categoryRepositoryMock.save).toHaveBeenCalledWith(categoryEntity);
    });

    it('should throw if a duplicated category is created', async () => {
      // ARRANGE
      const db_duplicated_error = new QueryFailedError<any>(
        'query',
        [],
        new Error('', {}),
      );
      db_duplicated_error.driverError.code = '23505';

      categoryRepositoryMock.save.mockRejectedValue(db_duplicated_error);

      // ACT
      const promise = categoryService.createCategory(createCategoryDTO);

      // ASSERT
      await expect(promise).rejects.toThrow(
        CATALOG_ERRORS.DB_DUPLICATED_ERROR('category'),
      );
      expect(categoryRepositoryMock.save).toHaveBeenCalledWith(categoryEntity);
    });
  });
});
