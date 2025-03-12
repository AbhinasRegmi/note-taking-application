import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { NoteService } from './note.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { User } from 'src/common/decorators/user.decorator';
import { UserT } from 'src/common/types/user.type';

@Controller({
  path: 'notes',
  version: '1',
})
export class NotesController {
  constructor(private readonly noteService: NoteService) {}

  @ApiOperation({ summary: 'List all notes' })
  @ApiBearerAuth()
  @Get()
  async findAll(@User() loggedUser: UserT) {
    return await this.noteService.findAll();
  }

  @ApiOperation({ summary: 'Create a note' })
  @ApiBearerAuth()
  @Post()
  async create(@User() loggedUser: UserT) {
    return await this.noteService.create();
  }

  @ApiOperation({ summary: 'View a note' })
  @ApiBearerAuth()
  @Get(':id')
  async view(@Param(':id') id: string, @User() loggedUser: UserT) {
    return await this.noteService.view();
  }

  @ApiOperation({ summary: 'Update a note' })
  @ApiBearerAuth()
  @Patch(':id')
  async update(@Param('id') id: string, @User() loggedUser: UserT) {
    return await this.noteService.update();
  }

  @ApiOperation({ summary: 'Delete a note' })
  @ApiBearerAuth()
  @Delete(':id')
  async delete(@Param('id') id: string, @User() loggedUser: UserT) {
    return await this.noteService.delete();
  }
}
