// follow.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Follow } from '../entities/follow.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(Follow)
    private followRepo: Repository<Follow>,
  ) {}

  async followUser(followerId: number, followingId: number): Promise<Follow> {
    const follow = this.followRepo.create({ follower_id: followerId, following_id: followingId });
    return this.followRepo.save(follow);
  }

  async unfollowUser(followerId: number, followingId: number): Promise<void> {
    await this.followRepo.delete({ follower_id: followerId, following_id: followingId });
  }

  async isFollowing(followerId: number, followingId: number): Promise<boolean> {
    const count = await this.followRepo.count({ where: { follower_id: followerId, following_id: followingId } });
    return count > 0;
  }

  async countFollowers(userId: number): Promise<number> {
    return this.followRepo.count({ where: { following_id: userId } });
  }

  async countFollowing(userId: number): Promise<number> {
    return this.followRepo.count({ where: { follower_id: userId } });
  }
}
