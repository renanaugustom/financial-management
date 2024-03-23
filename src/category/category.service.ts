import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';

import { Category } from './category.entity';
import { CategoryListDTO } from './dtos/category-list.dto';
import { CATALOG_ERRORS } from 'expceptions/catalog-errors';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async listAll(): Promise<Array<CategoryListDTO>> {
    try {
      const categories = await this.categoryRepository.find();

      return categories.map((category) => {
        return plainToInstance(CategoryListDTO, category, {
          excludeExtraneousValues: true,
        });
      });
    } catch (error) {
      console.log(error);
      throw CATALOG_ERRORS.SERVER_ERROR;
    }
  }
}
