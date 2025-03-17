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
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from 'src/common/decorators/user.decorator';
import { UserT } from 'src/common/types/user.type';
import { CreateNoteDto } from './dtos/create-note.dto';
import { UpdateNoteDto } from './dtos/update-note.dto';
import { NoteQueryDto } from './dtos/query.dto';
import {
  ResponseDto400,
  ResponseDto401,
  ResponseDto404,
} from 'src/common/dtos/response.dto';
import {
  DeleteResponse200,
  DeleteResponse409,
  FindAllResponse200,
  UpdateResponse409,
} from './dtos/response.dto';

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
  path: 'notes',
  version: '1',
})
export class NotesController {
  constructor(private readonly noteService: NoteService) {}

  @ApiOperation({ summary: 'List all notes' })
  @ApiBearerAuth()
  @ApiResponse({
    description: 'ok response',
    status: 200,
    type: [FindAllResponse200],
  })
  @Get()
  async findAll(@Query() query: NoteQueryDto, @User() loggedUser: UserT) {
    return await this.noteService.findAll(loggedUser.userId, query);
  }

  @ApiOperation({ summary: 'Create a note' })
  @ApiBearerAuth()
  @ApiResponse({
    description: 'ok response',
    status: 200,
    type: FindAllResponse200,
  })
  @ApiResponse({
    description: 'bad response',
    status: 409,
    type: UpdateResponse409,
  })
  @Post()
  async create(@Body() noteDto: CreateNoteDto, @User() loggedUser: UserT) {
    return await this.noteService.create(noteDto, loggedUser);
  }

  @ApiOperation({ summary: 'View a note' })
  @ApiBearerAuth()
  @ApiResponse({
    description: 'ok response',
    status: 200,
    type: FindAllResponse200,
  })
  @ApiResponse({
    description: 'bad response',
    status: 404,
    type: ResponseDto404,
  })
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
  @ApiResponse({
    description: 'bad response',
    status: 404,
    type: ResponseDto404,
  })
  @ApiResponse({
    description: 'ok response',
    status: 200,
    type: FindAllResponse200,
  })
  @ApiResponse({
    description: 'bad response',
    status: 409,
    type: UpdateResponse409,
  })
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
  @ApiResponse({
    description: 'ok response',
    status: 200,
    type: DeleteResponse200,
  })
  @ApiResponse({
    description: 'bad response',
    status: 404,
    type: ResponseDto404,
  })
  @ApiResponse({
    description: 'bad response',
    status: 409,
    type: DeleteResponse409,
  })
  @Delete(':id')
  async delete(@Param('id') id: string, @User() loggedUser: UserT) {
    const note = await this.noteService.view(+id);

    if (note.userId !== loggedUser.userId) {
      throw new HttpException('Note not found', HttpStatus.NOT_FOUND);
    }

    return await this.noteService.delete(+id);
  }
}
