import { forwardRef, Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { AuthModule } from 'src/domain/auth/auth.module';

@Module({
  imports: [
    AuthModule
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
