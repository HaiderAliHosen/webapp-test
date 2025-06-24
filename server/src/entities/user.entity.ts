import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Murmur } from './murmur.entity';
import { Like } from './like.entity';
import { Follow } from './follow.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ nullable: true })
  avatar_url: string;

  @OneToMany(() => Murmur, murmur => murmur.user)
  murmurs: Murmur[];

  @OneToMany(() => Like, like => like.user)
  likes: Like[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @OneToMany(() => Follow, follow => follow.follower)
  followers: Follow[];

  @OneToMany(() => Follow, follow => follow.following)
  following: Follow[];
}
