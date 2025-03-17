import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';

import config from 'src/common/config';
import { PrismaModule } from 'src/domain/prisma/prisma.module';
import { RequestLog } from 'src/common/interceptors/requestLogger.interceptor';
import { UserModule } from './domain/users/users.module';
import { SessionGuard } from './common/guards/session.guard';
import { AuthModule } from './domain/auth/auth.module';
import { NoteModule } from './domain/notes/note.module';
import { CategoryModule } from './domain/categories/category.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EmailModule } from './common/notifications/email/email.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    PrismaModule,
    EventEmitterModule.forRoot(),
    EmailModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
      renderPath: '*',
      exclude: ['/api*'],
    }),
    
    // routes
    AuthModule,
    UserModule,
    NoteModule,
    CategoryModule
  ],
  controllers: [
    AppController,
  ],
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
          transformOptions: {enableImplicitConversion: true}
        }),
    },
    {
      provide: APP_GUARD,
      useClass: SessionGuard, 
    }
  ],
})
export class AppModule {}
