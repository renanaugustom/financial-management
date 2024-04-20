import { Controller, Get, Post, Body } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiBody,
  ApiTags,
} from '@nestjs/swagger';

import { CategoryService } from '@src/category/category.service';
import { CategoryListDTO } from '@src/category/dtos/category-list.dto';
import { CategoryCreateDTO } from '@src/category/dtos/category-create.dto';
import { Roles } from '@src/auth/roles/roles.guard';
import { Role } from '@src/auth/dtos/role.enum';

@Controller('category')
@ApiTags('Category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get('/')
  @ApiOperation({
    summary: 'List all categories',
    tags: ['Category'],
  })
  @ApiOkResponse({
    description: 'List all categories',
    type: [CategoryListDTO],
  })
  async listAll(): Promise<Array<CategoryListDTO>> {
    return await this.categoryService.listAll();
  }

  @Post('/')
  @Roles(Role.Admin)
  @ApiOperation({
    summary: 'Create a new category',
    tags: ['Category'],
  })
  @ApiCreatedResponse({
    description: 'Category created successfully',
  })
  @ApiBadRequestResponse({
    description: 'Invalid category data',
  })
  @ApiBody({ type: CategoryCreateDTO, required: true })
  async createCategory(@Body() createCategoryDTO: CategoryCreateDTO) {
    return await this.categoryService.createCategory(createCategoryDTO);
  }
}
