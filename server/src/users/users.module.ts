import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Follow } from '../entities/follow.entity';
import { UsersService } from './users.service';
import { FollowService } from '../follow/follow.service';
import { UsersController } from './users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Follow])],
  providers: [UsersService, FollowService],
  controllers: [UsersController],
  exports: [UsersService], // Important for AuthService to access UsersService
})
export class UsersModule {}