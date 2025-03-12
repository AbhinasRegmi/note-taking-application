import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';

import config from 'src/common/config';
import { PrismaModule } from 'src/domain/prisma/prisma.module';
import { RequestLog } from 'src/common/interceptors/requestLogger.interceptor';
import { UserModule } from './domain/users/users.module';
import { SessionGuard } from './common/guards/session.guard';
import { AuthModule } from './domain/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    PrismaModule,
    
    // routes
    AuthModule,
    UserModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestLog,
    },
    {
      provide: APP_PIPE,
      useFactory: () =>
        new ValidationPipe({
          transform: true,
          whitelist: true,
        }),
    },
    {
      provide: APP_GUARD,
      useClass: SessionGuard, 
    }
  ],
})
export class AppModule {}
