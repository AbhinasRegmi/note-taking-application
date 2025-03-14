import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { PublicRoute } from 'src/common/decorators/public.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { UserT } from 'src/common/types/user.type';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(private readonly usersService: UsersService, 
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @ApiOperation({
    summary: 'Create a new user',
  })
  @PublicRoute()
  @Post()
  async create(@Body() userDto: CreateUserDto) {
    const response =  await this.usersService.create(userDto);
    
    this.eventEmitter.emit('notification.email.verify', {email: response.email});
    
    return response;
  }

  @ApiOperation({
    summary: 'Update a user',
  })
  @ApiBearerAuth()
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @User() loggedUser: UserT,
    @Body() userDto: UpdateUserDto,
  ) {
    // for now there are no roles so this might seem redundant
    if (loggedUser.userId !== Number(id)) {
      throw new HttpException('Unauthorized', 401);
    }

    return await this.usersService.update(userDto, +id);
  }

  @ApiOperation({
    summary: 'Get user profile',
  })
  @ApiBearerAuth()
  @Get(':id')
  async getProfile(@Param('id') id: string, @User() loggedUser: UserT) {

    if (loggedUser.userId !== Number(id)) {
      throw new HttpException('Unauthorized', 401);
    }

    return await this.usersService.findOne(+id);
  }
  
  @ApiOperation({
    summary: 'Delete a user',
  })
  @ApiBearerAuth()
  @Delete(':id')
  async deleteUser(@Param('id') id: string, @User() loggedUser: UserT) {
    if (loggedUser.userId !== Number(id)) {
      throw new HttpException('Unauthorized', 401);
    }

    return await this.usersService.delete(+id);
  }
}
