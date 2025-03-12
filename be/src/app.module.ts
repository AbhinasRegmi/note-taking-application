import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';

import config from 'src/common/config';
import { PrismaModule } from 'src/domain/prisma/prisma.module';
import { RequestLog } from 'src/common/interceptors/requestLogger.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    PrismaModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestLog,
    },
  ],
})
export class AppModule {}
