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
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserT } from 'src/common/types/user.type';
import { User } from 'src/common/decorators/user.decorator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryQuery, SearchCategoryQuery } from './dto/query.dto';
import { ResponseDto400, ResponseDto401, ResponseDto404 } from 'src/common/dtos/response.dto';
import {
  CreateCategoryResponse201,
  CreateCategoryResponse409,
  FindAllCategoryResponse200,
} from './dto/response.dto';
import { FindAllResponse200 } from '../notes/dtos/response.dto';

@ApiResponse({
  status: 401,
  description: 'bad response',
  type: ResponseDto401,
})
@ApiResponse({
  status: 400,
  description: 'bad response',
  type: ResponseDto400,
})
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
  @ApiResponse({
    status: 200,
    description: 'ok response',
    type: [FindAllCategoryResponse200],
  })
  @Get()
  async findAll(
    @Query() query: SearchCategoryQuery,
    @User() loggedUser: UserT,
  ) {
    return await this.categoryService.findAll(loggedUser.userId, query);
  }

  @ApiOperation({
    summary: 'Filter post with category',
  })

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'ok response',
    type: [FindAllResponse200],
  })
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
  @ApiResponse({
    status: 201,
    description: 'ok response',
    type: CreateCategoryResponse201,
  })
  @ApiResponse({
    status: 404,
    description: 'bad response',
    type: ResponseDto404,
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
  @ApiResponse({
    status: 201,
    description: 'ok response',
    type: CreateCategoryResponse201,
  })
  @ApiResponse({
    status: 409,
    description: 'bad response',
    type: CreateCategoryResponse409,
  })
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
  @ApiResponse({
    status: 404,
    description: 'bad response',
    type: ResponseDto404,
  })
  @ApiResponse({
    status: 201,
    description: 'ok response',
    type: CreateCategoryResponse201,
  })
  @ApiResponse({
    status: 409,
    description: 'bad response',
    type: CreateCategoryResponse409,
  })
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
  @ApiResponse({
    status: 404,
    description: 'bad response',
    type: ResponseDto404,
  })
  @ApiResponse({
    status: 200,
    description: 'ok response',
    type: CreateCategoryResponse201,
  })
  @Delete(':id')
  async delete(@Param('id') id: string, @User() loggedUser: UserT) {
    const category = await this.categoryService.view(+id);

    if (category.userId !== loggedUser.userId) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }

    return await this.categoryService.delete(category.id);
  }
}
