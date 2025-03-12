import { Controller, Param } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UserT } from 'src/common/types/user.type';
import { User } from 'src/common/decorators/user.decorator';

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
  async findAll() {
    return await this.categoryService.findAll();
  }

  @ApiOperation({
    summary: 'View a category',
  })
  @ApiBearerAuth()
  async view(@Param('id') id: string, @User() loggedUser: UserT) {
    return await this.categoryService.view();
  }

  @ApiOperation({
    summary: 'Create a category',
  })
  @ApiBearerAuth()
  async create() {
    return await this.categoryService.create();
  }

  @ApiOperation({
    summary: 'Update a category',
  })
  @ApiBearerAuth()
  async update(@Param('id') id: string, @User() loggedUser: UserT) {
    return await this.categoryService.update();
  }

  @ApiOperation({
    summary: 'Delete a category',
  })
  @ApiBearerAuth()
  async delete(@Param('id') id: string, @User() loggedUser: UserT) {
    return await this.categoryService.delete();
  }

}
