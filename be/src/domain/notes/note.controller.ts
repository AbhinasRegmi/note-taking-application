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
import { NoteService } from './note.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { User } from 'src/common/decorators/user.decorator';
import { UserT } from 'src/common/types/user.type';
import { CreateNoteDto } from './dtos/create-note.dto';
import { UpdateNoteDto } from './dtos/update-note.dto';
import { NoteQueryDto } from './dtos/query.dto';

@Controller({
  path: 'notes',
  version: '1',
})
export class NotesController {
  constructor(private readonly noteService: NoteService) {}

  @ApiOperation({ summary: 'List all notes' })
  @ApiBearerAuth()
  @Get()
  async findAll(@Query() query: NoteQueryDto, @User() loggedUser: UserT) {
    return await this.noteService.findAll(loggedUser.userId, query);
  }

  @ApiOperation({ summary: 'Create a note' })
  @ApiBearerAuth()
  @Post()
  async create(@Body() noteDto: CreateNoteDto, @User() loggedUser: UserT) {
    return await this.noteService.create(noteDto, loggedUser);
  }

  @ApiOperation({ summary: 'View a note' })
  @ApiBearerAuth()
  @Get(':id')
  async view(@Param(':id') id: string, @User() loggedUser: UserT) {
    let note;

    if (Number(id) > 0) {
      note = await this.noteService.view(+id);
    } else {
      note = await this.noteService.findBySlug(id, loggedUser.userId);
    }

    if (note.userId !== loggedUser.userId) {
      throw new HttpException('Note not found', HttpStatus.NOT_FOUND);
    }

    return note;
  }

  @ApiOperation({ summary: 'Update a note' })
  @ApiBearerAuth()
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @User() loggedUser: UserT,
    @Body() noteDto: UpdateNoteDto,
  ) {
    const note = await this.noteService.view(+id);

    if (note.userId !== loggedUser.userId) {
      throw new HttpException('Note not found', HttpStatus.NOT_FOUND);
    }

    return await this.noteService.update(+id, noteDto, note.userId);
  }

  @ApiOperation({ summary: 'Delete a note' })
  @ApiBearerAuth()
  @Delete(':id')
  async delete(@Param('id') id: string, @User() loggedUser: UserT) {
    const note = await this.noteService.view(+id);

    if (note.userId !== loggedUser.userId) {
      throw new HttpException('Note not found', HttpStatus.NOT_FOUND);
    }

    return await this.noteService.delete(+id);
  }
}
