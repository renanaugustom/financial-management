import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';

import { Category } from '@src/category/category.entity';
import { CategoryListDTO } from '@src/category/dtos/category-list.dto';

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
}
