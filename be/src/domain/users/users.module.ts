import { Module } from '@nestjs/common';
import { UsersService } from 'src/domain/users/users.service';
import { UsersController } from 'src/domain/users/users.controller';

@Module({
  imports: [],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [],
})
export class UserModule {}
