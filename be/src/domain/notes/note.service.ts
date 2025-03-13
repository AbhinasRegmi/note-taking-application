import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateNoteDto } from './dtos/create-note.dto';
import { UserT } from 'src/common/types/user.type';
import { PrismaService } from '../prisma/prisma.service';
import { slugify } from 'src/common/utils/slug';
import { UpdateNoteDto } from './dtos/update-note.dto';
import { NoteQueryDto } from './dtos/query.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class NoteService {
  private logger = new Logger(NoteService.name);

  constructor(private readonly db: PrismaService) {}

  async findAll(userId: number, query: NoteQueryDto) {
    try {
      if (!query.search) {
        const response = await this.db.note.findMany({
          where: {
            userId,
          },
          include: {
            categories: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            [query.orderBy]: query.sortOrder,
          },
          skip: query.page * query.take,
          take: query.take,
        });

        return response;
      } else {
        // according to prisma docs there is performance issue with full text search with postgres when using prisma query
        // so i am doing a raw query here it is still sanitized by prisma to avoid injections
        const response = await this.db.$queryRaw<
          {
            id: string;
            title: string;
            content: string;
            slug: string;
            rank: string;
            categories: string[];
          }[]
        >(
          Prisma.sql`
select 
n.id as id,
n.title  as title,
n.content as content,
n.slug as slug,
n."userId" as "userId",
n."createdAt" as "createdAt",
(
  select array_agg(c.name)
  from "_CategoryToNote" ctn
  join categories c on c.id = ctn."A"
  where ctn."B" = n.id
) as "categories",
ts_rank(to_tsvector(n.title|| ' ' || n.content), websearch_to_tsquery(${query.search})) as rank
from notes n
where to_tsvector(n.title || ' ' || n.content) @@ websearch_to_tsquery(${query.search}) and n."userId" = ${userId}
order by rank desc, n."updatedAt" asc 
limit ${query.take} 
offset ${query.take * query.page} 
`,
        );

        return response;
      }
    } catch (e) {
      this.logger.error(e);

      throw new HttpException(
        'Cannot list notes',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async view(noteId: number) {
    try {
      const response = await this.db.note.findFirst({
        where: {
          id: noteId,
        },
        include: {
          categories: {
            select: {
              name: true,
            },
          },
        },
      });

      if (!response) {
        throw new HttpException('Note not found', HttpStatus.NOT_FOUND);
      }

      return response;
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }

      this.logger.error(e);
      throw new HttpException(
        'Cannot view note',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findBySlug(slug: string, userId: number) {
    try {
      const response = await this.db.note.findFirst({
        where: {
          slug,
          userId,
        },
        include: {
          categories: {
            select: {
              name: true,
            },
          },
        },
      });

      if (!response) {
        throw new HttpException('Note not found', HttpStatus.NOT_FOUND);
      }

      return response;
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }

      this.logger.error(e);
      throw new HttpException(
        'Cannot view note',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(noteDto: CreateNoteDto, user: UserT) {
    try {
      const response = await this.db.note.create({
        data: {
          title: noteDto.title,
          slug: noteDto.slug ?? slugify(noteDto.title),
          content: noteDto.content,
          userId: user.userId,
          categories: {
            connectOrCreate: noteDto.categories?.map((category) => ({
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

      throw new HttpException(
        'Cannot create a new note. Try again with different title',
        HttpStatus.CONFLICT,
      );
    }
  }

  async update(id: number, noteDto: UpdateNoteDto, userId: number) {
    try {
      const response = await this.db.note.update({
        where: {
          id,
        },
        data: {
          title: noteDto.title,
          slug: noteDto.slug ?? slugify(noteDto.title),
          content: noteDto.content,
          categories: {
            connectOrCreate: noteDto.categories?.map((category) => ({
              where: {
                name_userId: {
                  name: category,
                  userId,
                },
              },
              create: {
                name: category,
                userId,
              },
            })),
          },
        },
      });

      return response;
    } catch (e) {
      this.logger.error(e);

      throw new HttpException(
        'Cannot update note. Try again with different title.',
        HttpStatus.CONFLICT,
      );
    }
  }

  async delete(id: number) {
    try {
      const response = await this.db.note.delete({
        where: {
          id,
        },
      });

      return response;
    } catch (e) {
      this.logger.error(e);

      throw new HttpException(
        'Cannot delete note. Try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
