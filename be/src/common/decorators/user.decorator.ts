import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { LoginRequiredError } from '../exceptions/auth.exceptions';
import { UserT } from '../types/user.type';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx
      .switchToHttp()
      .getRequest<Request & UserT>();

    if (!request.userId) {
      throw LoginRequiredError;
    }

    return {
      userId: request.userId,
    };
  },
);
