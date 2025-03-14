import { Body, Controller, forwardRef, Get, Inject, Post, Query, Res } from '@nestjs/common';
import { ROUTES } from 'src/common/constants/routes.constant';
import { LoginDto } from './dtos/login.dto';
import { PublicRoute } from 'src/common/decorators/public.decorator';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { query, Response } from 'express';
import { AuthService } from './auth.service';
import { User } from 'src/common/decorators/user.decorator';
import { UserT } from 'src/common/types/user.type';
import { AuthQueryDto, AuthVerificationQueryDto } from './dtos/auth-query.dto';
import { EmailService } from 'src/common/notifications/email/email.service';
import { SuiteContext } from 'node:test';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @ApiOperation({
    summary: 'Login a existing user with email and password',
  })
  @PublicRoute()
  @Post('/login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }
  
  @ApiOperation({
    summary: 'Login a existing user with sst url',
  })
  @PublicRoute()
  @Get('/login/sst')
  async loginSst(@Query() query: AuthQueryDto){
    return await this.authService.loginSst(query);
  }
  
  @ApiOperation({
    summary: 'Generate a temporary sst url for login'
  })
  @PublicRoute()
  @Get('/send/sst')
  async sendSst(@Query() query: AuthVerificationQueryDto){
    
    this.eventEmitter.emit('notification.email.sstlogin', {email: query.email});
    
    return {
      success: true,
      message: 'Single time login link has been sent to the given email address.',
    };
  }

  @ApiOperation({
    summary: 'Generate a verification link for user account',
  })
  @PublicRoute()
  @Get('/send/verification-link')
  async send(@Query() query: AuthVerificationQueryDto) {
    
    this.eventEmitter.emit('notification.email.verify', {email: query.email});
    
    return {
      success: true,
      message: 'Verification link has been sent to the given email address.',
    };
  }

  @ApiOperation({
    summary: 'Verify a user account from verification link',
  })
  @PublicRoute()
  @Get('/verify')
  async verifyAccount(@Query() query: AuthQueryDto) {
    return await this.authService.verifyAccount(query);
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
  async logout(@User() loggedUser: UserT) {
    return await this.authService.logout(loggedUser);
  }
}
