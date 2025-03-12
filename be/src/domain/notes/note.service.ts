import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateNoteDto } from './dtos/create-note.dto';
import { UserT } from 'src/common/types/user.type';
import { PrismaService } from '../prisma/prisma.service';
import { slugify } from 'src/common/utils/slug';

@Injectable()
export class NoteService {
  private logger = new Logger(NoteService.name);

  constructor(private readonly db: PrismaService) {}

  async findAll() {}

  async view() {}

  async create(noteDto: CreateNoteDto, user: UserT) {
    try {
      const response = await this.db.note.create({
        data: {
          title: noteDto.title,
          slug: noteDto.slug ?? slugify(noteDto.title),
          content: noteDto.content,
          userId: user.userId,
          categories: {
            connectOrCreate: noteDto.categories.map((category) => ({
              where: {
                name_userId: {
                  name: category,
                  userId: user.userId,
                },
              },
              create: {
                name: category,
                userId: user.userId,
              },
            })),
          },
        },
      });
      
      return response;
    } catch (e) {
      this.logger.error(e);

      throw new HttpException('Cannot create a new note. Try again with different title', HttpStatus.CONFLICT);
    }
  }

  async update() {}

  async delete() {}
}
