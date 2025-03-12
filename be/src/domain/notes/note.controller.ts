import { Controller, Param } from '@nestjs/common';
import { NoteService } from './note.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { User } from 'src/common/decorators/user.decorator';
import { UserT } from 'src/common/types/user.type';

@Controller({
  path: 'notes',
  version: '1',
})
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @ApiOperation({ summary: 'List all notes' })
  @ApiBearerAuth()
  async findAll(@User() loggedUser: UserT) {
    return await this.noteService.findAll();
  }

  @ApiOperation({ summary: 'Create a note' })
  @ApiBearerAuth()
  async create(@User() loggedUser: UserT) {
    return await this.noteService.create();
  }

  @ApiOperation({ summary: 'View a note' })
  @ApiBearerAuth()
  async view(@Param(':id') id: string, @User() loggedUser: UserT) {
    return await this.noteService.view();
  }

  @ApiOperation({ summary: 'Update a note' })
  @ApiBearerAuth()
  async update(@Param('id') id: string, @User() loggedUser: UserT) {
    return await this.noteService.update();
  }

  @ApiOperation({ summary: 'Delete a note' })
  @ApiBearerAuth()
  async delete(@Param('id') id: string, @User() loggedUser: UserT) {
    return await this.noteService.delete();
  }
}
