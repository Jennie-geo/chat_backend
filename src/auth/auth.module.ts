import { Module } from '@nestjs/common';
import { AuthsService } from './auth.service';
import { UsersController } from './auth.controller';

@Module({
  controllers: [UsersController],
  providers: [AuthsService],
})
export class UsersModule {}
