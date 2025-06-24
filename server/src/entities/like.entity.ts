import { Entity, PrimaryColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Murmur } from './murmur.entity';

@Entity()
export class Like {
  @PrimaryColumn()
  user_id: number;

  @PrimaryColumn()
  murmur_id: number;

  @ManyToOne(() => User, user => user.likes, { eager: true })
  user: User;

  @ManyToOne(() => Murmur, murmur => murmur.likes)
  murmur: Murmur;

  @CreateDateColumn()
  created_at: Date;
}