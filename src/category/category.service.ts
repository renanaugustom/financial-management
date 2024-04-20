import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';

import { Category } from '@src/category/category.entity';
import { CategoryListDTO } from '@src/category/dtos/category-list.dto';
import { CategoryCreateDTO } from './dtos/category-create.dto';
import { CATALOG_ERRORS } from '@src/exceptions/catalog-errors';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async listAll(): Promise<Array<CategoryListDTO>> {
    const categories = await this.categoryRepository.find();

    return categories.map((category) => {
      return plainToInstance(CategoryListDTO, category, {
        excludeExtraneousValues: true,
      });
    });
  }

  async createCategory(categoryDTO: CategoryCreateDTO) {
    const categoryEntity = plainToInstance(Category, categoryDTO);

    try {
      await this.categoryRepository.save(categoryEntity);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        if (error.driverError.code === '23505') {
          throw CATALOG_ERRORS.DB_DUPLICATED_ERROR('category');
        }
      }

      throw error;
    }
  }
}
