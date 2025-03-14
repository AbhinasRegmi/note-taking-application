import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PUBLIC_ROUTE_META_KEY } from '../decorators/public.decorator';
import { PrismaService } from 'src/domain/prisma/prisma.service';
import {
  BearerTokenNotFoundError,
  BearerTokenNotValidError,
} from '../exceptions/auth.exceptions';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly db: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const isPublicRoute = this.reflector.getAllAndOverride(
      PUBLIC_ROUTE_META_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (isPublicRoute) {
      return true;
    }

    const sessionToken = this.getTokenFromHeader(request);
    const userId = await this.getUserFromSession(sessionToken);

    request['userId'] = userId;

    return true;
  }

  async getUserFromSession(token: string): Promise<number> {
    const response = await this.db.session.findUnique({
      where: {
        value: token,
      },
      select: {
        userId: true,
      },
    });

    if (!response) {
      throw BearerTokenNotValidError;
    }

    return +response.userId;
  }

  getTokenFromHeader(request: Request) {
    const [type, token] = request?.headers?.authorization?.split(' ') ?? [];

    if (type != this.config.get('core.tokenType')) {
      throw BearerTokenNotFoundError;
    }

    return token;
  }
}
