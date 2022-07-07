import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from './users.service';

@Module({
  providers: [UsersService, ConfigService],
  exports: [UsersService],
})
export class UsersModule {}
