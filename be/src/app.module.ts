import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import config from 'src/common/config';
import { PrismaModule } from 'src/domain/prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    PrismaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
