import {
  CallHandler,
  ExecutionContext,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

export class RequestLog implements NestInterceptor {
  private readonly logger = new Logger(RequestLog.name);

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();

    const { ip, method, path: url } = request;
    const controller = context.getClass();
    const handler = context.getHandler();

    this.logger.log(`${ip} ${method} ${url} ${controller.name} ${handler.name}`);

    return next.handle();
  }
}
