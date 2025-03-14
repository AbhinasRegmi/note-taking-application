import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { response } from 'express';

@Injectable()
export class CategoryService {
  private logger = new Logger(CategoryService.name);

  constructor(private readonly db: PrismaService) {}

  async filterNotes(
    userId: number,
    categories: string[],
  ) {
    try {
      const response = await this.db.note.findMany({
        where: {
          userId,
          AND: categories.map((cat) => ({
            categories: {
              some: {
                name: cat,
              },
            },
          })),
        },
        include: {
          categories: {
            select: {
              name: true,
            },
          },
        },
      });

      return response;
    } catch (e) {
      this.logger.error(e);

      throw new HttpException('Cannot filter notes', HttpStatus.CONFLICT);
    }
  }

  async findAll(userId: number, query: PaginationDto) {
    try {
      const response = await this.db.category.findMany({
        where: {
          userId,
        },
        include: {
          notes: {
            select: {
              title: true,
              id: true,
            },
          },
        },
        skip: query.page * query.take,
        take: query.take,
      });

      return response;
    } catch (e) {
      this.logger.error(e);

      throw new HttpException(
        'Cannot find all the categories',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async view(categoryId: number) {
    try {
      const response = await this.db.category.findFirst({
        where: {
          id: categoryId,
        },
        include: {
          notes: {
            select: {
              title: true,
              id: true,
            },
          },
        },
      });

      if (!response) {
        throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
      }

      return response;
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }

      this.logger.error(e);
      throw new HttpException(
        'Cannot view Category',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(categoryDto: CreateCategoryDto, userId: number) {
    try {
      const response = await this.db.category.create({
        data: {
          userId,
          name: categoryDto.name,
        },
      });

      return response;
    } catch (e) {
      this.logger.error(e);

      throw new HttpException(
        'Cannot create a new category. Try a different name',
        HttpStatus.CONFLICT,
      );
    }
  }

  async update(categoryDto: UpdateCategoryDto, categoryId: number) {
    try {
      const response = await this.db.category.update({
        where: {
          id: categoryId,
        },
        data: {
          name: categoryDto.name,
        },
        include: {
          notes: true,
        },
      });

      return response;
    } catch (e) {
      this.logger.error(e);

      throw new HttpException(
        'Cannot update the category. Please try again with different name',
        HttpStatus.CONFLICT,
      );
    }
  }

  async delete(categoryId: number) {
    try {
      await this.db.category.delete({
        where: {
          id: categoryId,
        },
      });

      return response;
    } catch (e) {
      this.logger.error(e);

      throw new HttpException(
        'Cannot delete this category. Please try again later',
        HttpStatus.CONFLICT,
      );
    }
  }
}
