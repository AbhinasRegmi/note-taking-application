import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from 'src/domain/users/users.service';
import { UsersController } from 'src/domain/users/users.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UserModule {}
