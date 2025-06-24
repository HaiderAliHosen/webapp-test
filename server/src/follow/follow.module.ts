import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Follow } from '../entities/follow.entity';
import { FollowService } from './follow.service';

@Module({
  imports: [TypeOrmModule.forFeature([Follow])],
  providers: [FollowService],
  exports: [FollowService], // 👈 Export the service so other modules can use it
})
export class FollowModule {}
