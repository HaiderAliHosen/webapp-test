import { Request } from 'express';
import { Controller, Get, Post, Body, Param, UseGuards, Delete, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../entities/user.entity';
import { JwtAuthGuard } from '../auth/auth.guard';
import { FollowService } from '../follow/follow.service';

@Controller('api/users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly followService: FollowService
  ) {}

  @Post()
  async create(@Body() userData: Partial<User>): Promise<User> {
    return this.usersService.create(userData);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findById(+id);
  }

  @Get('username/:username')
  async findByUsername(@Param('username') username: string): Promise<User> {
    return this.usersService.findOne(username);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/follow')
  async follow(@Param('id') id: string, @Req() req: Request) {
    const followerId = req.user['id'];
    return this.followService.followUser(followerId, +id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/follow')
  async unfollow(@Param('id') id: string, @Req() req: Request) {
    const followerId = req.user['id'];
    return this.followService.unfollowUser(followerId, +id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/follow/status')
  async isFollowing(@Param('id') id: string, @Req() req: Request) {
    const followerId = req.user['id'];
    const followingId = +id;
    const status = await this.followService.isFollowing(followerId, followingId);
    return { isFollowing: status };
  }

  @Get(':id/followers/count')
  async getFollowersCount(@Param('id') id: string) {
    return this.followService.countFollowers(+id);
  }

  @Get(':id/following/count')
  async getFollowingCount(@Param('id') id: string) {
    return this.followService.countFollowing(+id);
  }
}
