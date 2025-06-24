import { Entity, PrimaryColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Follow {
  @PrimaryColumn()
  follower_id: number;

  @PrimaryColumn()
  following_id: number;

  @ManyToOne(() => User, user => user.followers)
  follower: User;

  @ManyToOne(() => User, user => user.following)
  following: User;

  @CreateDateColumn()
  created_at: Date;
}