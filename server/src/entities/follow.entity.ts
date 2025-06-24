import { Entity, PrimaryColumn, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Follow {
  @PrimaryColumn()
  follower_id: number;

  @PrimaryColumn()
  following_id: number;

  @ManyToOne(() => User, user => user.followers)
  @JoinColumn({ name: 'user_id' }) // Explicit join column
  follower: User;

  @ManyToOne(() => User, user => user.following)
  @JoinColumn({ name: 'user_id' }) // Explicit join column
  following: User;

  @CreateDateColumn()
  created_at: Date;
}