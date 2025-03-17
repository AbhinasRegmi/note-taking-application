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
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { PublicRoute } from 'src/common/decorators/public.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { UserT } from 'src/common/types/user.type';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  SignupResponse201,
  SignupResponse400,
  SignupResponse409,
} from '../auth/dtos/response.dto';
import { ResponseDto400, ResponseDto401 } from 'src/common/dtos/response.dto';
import {
  DeleteUserResponse200,
  GetProfileResponse200,
} from './dtos/response.dto';

@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @ApiOperation({
    summary: 'Create a new user',
  })
  @ApiResponse({
    description: 'ok response',
    status: 201,
    type: SignupResponse201,
  })
  @ApiResponse({
    description: 'bad response',
    status: 409,
    type: SignupResponse409,
  })
  @ApiResponse({
    description: 'bad response',
    status: 400,
    type: SignupResponse400,
  })
  @PublicRoute()
  @Post()
  async create(@Body() userDto: CreateUserDto) {
    const response = await this.usersService.create(userDto);

    this.eventEmitter.emit('notification.email.verify', {
      email: response.email,
    });

    return response;
  }

  @ApiOperation({
    summary: 'Update a user',
  })
  @ApiBearerAuth()
  @ApiResponse({
    description: 'ok response',
    status: 200,
    type: GetProfileResponse200,
  })
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
    summary: 'Get your user profile',
  })
  @ApiBearerAuth()
  @ApiResponse({
    description: 'ok response',
    status: 200,
    type: GetProfileResponse200,
  })
  @ApiResponse({
    description: 'bad response',
    status: 401,
    type: ResponseDto401,
  })
  @Get('/profile')
  async getMyProfile(@User() loggedUser: UserT) {
    return await this.usersService.findOne(+loggedUser.userId);
  }

  @ApiOperation({
    summary: 'Get user profile',
  })
  @ApiBearerAuth()
  @ApiResponse({
    description: 'ok response',
    status: 200,
    type: GetProfileResponse200,
  })
  @ApiResponse({
    description: 'bad response',
    status: 401,
    type: ResponseDto401,
  })
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
  @ApiResponse({
    description: 'bad response',
    status: 401,
    type: ResponseDto401,
  })
  @ApiResponse({
    description: 'ok response',
    status: 200,
    type: DeleteUserResponse200,
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
