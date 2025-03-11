import { Module } from '@nestjs/common';
import { UsersService } from 'src/modules/users/users.service';
import { UsersController } from 'src/modules/users/users.controller';

@Module({
  imports: [],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [],
})
export class UserModule {}
