import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { CategoryService } from '@src/category/category.service';
import { CategoryListDTO } from '@src/category/dtos/category-list.dto';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get('/')
  @ApiOperation({
    summary: 'List all categories',
    tags: ['Category'],
  })
  @ApiOkResponse({
    description: 'List all categories',
  })
  async listAll(): Promise<Array<CategoryListDTO>> {
    return await this.categoryService.listAll();
  }
}
