import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Like } from './like.entity';

@Entity('murmurs') // Explicit table name
export class Murmur {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' }) // Match exact column name
  user_id: number;

  @ManyToOne(() => User, user => user.murmurs)
  @JoinColumn({ name: 'user_id' }) // Explicit join column
  user: User;

  @OneToMany(() => Like, like => like.murmur)
  likes: Like[];

  @Column('text')
  content: string;

  @Column({ 
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP'
  })
  created_at: Date;

  @Column({ 
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP'
  })
  updated_at: Date;
}