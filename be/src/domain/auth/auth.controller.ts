import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { ROUTES } from 'src/common/constants/routes.constant';
import { LoginDto } from './dtos/login.dto';
import { PublicRoute } from 'src/common/decorators/public.decorator';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { User } from 'src/common/decorators/user.decorator';
import { UserT } from 'src/common/types/user.type';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @ApiOperation({
    summary: 'Login a existing user',
  })
  @PublicRoute()
  @Post('/login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @ApiOperation({
    summary: 'Sign up a new user',
  })
  @Post('/signup')
  @PublicRoute()
  signup(@Body() userDto: CreateUserDto, @Res() res: Response) {
    res.redirect(307, ROUTES.CREATE_USER_V1);
  }
  
  @ApiOperation({
    summary: 'Logout a user',
  })
  @ApiBearerAuth()
  @Get('/logout')
  async logout(@User() loggedUser: UserT){
    return await this.authService.logout(loggedUser);
  }
}
