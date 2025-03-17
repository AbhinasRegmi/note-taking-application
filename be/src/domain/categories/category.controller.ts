import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UserT } from 'src/common/types/user.type';
import { User } from 'src/common/decorators/user.decorator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryQuery, SearchCategoryQuery } from './dto/query.dto';

@Controller({
  path: 'categories',
  version: '1',
})
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({
    summary: 'List all categories',
  })
  @ApiBearerAuth()
  @Get()
  async findAll(@Query() query: SearchCategoryQuery, @User() loggedUser: UserT) {
    return await this.categoryService.findAll(loggedUser.userId, query);
  }

  @ApiOperation({
    summary: 'Filter post with category',
  })
  @ApiBearerAuth()
  @Get('/filter')
  async filterWithCategory(
    @Query() query: CategoryQuery,
    @User() loggedUser: UserT,
  ) {
    return await this.categoryService.filterNotes(
      loggedUser.userId,
      query.categories,
    );
  }

  @ApiOperation({
    summary: 'View a category',
  })
  @ApiBearerAuth()
  @Get(':id')
  async view(@Param('id') id: string, @User() loggedUser: UserT) {
    const category = await this.categoryService.view(+id);

    if (category.userId !== loggedUser.userId) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }

    return category;
  }

  @ApiOperation({
    summary: 'Create a category',
  })
  @ApiBearerAuth()
  @Post()
  async create(
    @Body() categoryDto: CreateCategoryDto,
    @User() loggedUser: UserT,
  ) {
    return await this.categoryService.create(categoryDto, loggedUser.userId);
  }

  @ApiOperation({
    summary: 'Update a category',
  })
  @ApiBearerAuth()
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @User() loggedUser: UserT,
    @Body() categoryDto: UpdateCategoryDto,
  ) {
    const category = await this.categoryService.view(+id);

    if (category.userId !== loggedUser.userId) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }

    return await this.categoryService.update(categoryDto, category.id);
  }

  @ApiOperation({
    summary: 'Delete a category',
  })
  @ApiBearerAuth()
  @Delete(':id')
  async delete(@Param('id') id: string, @User() loggedUser: UserT) {
    const category = await this.categoryService.view(+id);

    if (category.userId !== loggedUser.userId) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }

    return await this.categoryService.delete(category.id);
  }
}
