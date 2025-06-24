import { Entity, PrimaryColumn, ManyToOne, Column, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Murmur } from './murmur.entity';

@Entity('likes') // Explicit table name
export class Like {
  @PrimaryColumn({ name: 'user_id' }) // Match exact column name
  user_id: number;

  @PrimaryColumn({ name: 'murmur_id' }) // Match exact column name
  murmur_id: number;

  @ManyToOne(() => User, user => user.likes)
  @JoinColumn({ name: 'user_id' }) // Explicit join column
  user: User;

  @ManyToOne(() => Murmur, murmur => murmur.likes)
  @JoinColumn({ name: 'murmur_id' }) // Explicit join column
  murmur: Murmur;

  @Column({ 
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP'
  })
  created_at: Date;
}