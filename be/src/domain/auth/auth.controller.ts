import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { ROUTES } from 'src/common/constants/routes.constant';
import { LoginDto } from './dtos/login.dto';
import { PublicRoute } from 'src/common/decorators/public.decorator';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { User } from 'src/common/decorators/user.decorator';
import { UserT } from 'src/common/types/user.type';
import { AuthQueryDto, AuthVerificationQueryDto } from './dtos/auth-query.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ConfigService } from '@nestjs/config';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly eventEmitter: EventEmitter2,
    private readonly config: ConfigService,
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
  async loginSst(@Query() query: AuthQueryDto, @Res() res: Response) {
    const baseUrl = this.config.get('core.frontendUrl');
    try {
      const response = await this.authService.loginSst(query);

      if (response.success) {
        return res.redirect(
          `${baseUrl}/auth/forgot-password?token=${response.value}`,
        );
      }

      return res.redirect(
        `${baseUrl}/auth/forgot-password?emessage=${response.message}`,
      );
    } catch {
      return res.redirect(
        `${baseUrl}/auth/forgot-password?emessage=Link has expired. Please try again`,
      );
    }
  }

  @ApiOperation({
    summary: 'Generate a temporary sst url for login',
  })
  @PublicRoute()
  @Get('/send/sst')
  async sendSst(@Query() query: AuthVerificationQueryDto) {
    this.eventEmitter.emit('notification.email.sstlogin', {
      email: query.email,
    });

    return {
      success: true,
      message:
        'Single time login link has been sent to the given email address.',
    };
  }

  @ApiOperation({
    summary: 'Generate a verification link for user account',
  })
  @PublicRoute()
  @Get('/send/verification-link')
  async send(@Query() query: AuthVerificationQueryDto) {
    this.eventEmitter.emit('notification.email.verify', { email: query.email });

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
  async verifyAccount(@Query() query: AuthQueryDto, @Res() res: Response) {
    const baseUrl = this.config.get('core.frontendUrl');
    try {
      const response = await this.authService.verifyAccount(query);

      if (!response.success) {
        res.redirect(
          `${baseUrl}/auth/forgot-password?emessage=${response.message}`,
        );
      }

      res.redirect(`${baseUrl}/auth/login`);
    } catch {
      res.redirect(
        `${baseUrl}/auth/forgot-password?emessage=Link has expired. Please generate a new link.`,
      );
    }
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
