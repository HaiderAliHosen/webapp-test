import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Follow } from 'src/entities/follow.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    
    @InjectRepository(Follow)
    private followRepo: Repository<Follow>,
  ) {}

  async findOne(username: string, options?: FindOneOptions<User>): Promise<User | undefined> {
    return this.usersRepository.findOne({ 
      where: { username },
      ...options
    });
  }

async findById(id: number): Promise<any> {
  const user = await this.usersRepository.findOne({
    where: { id },
  });
  console.log(id);

  if (!user) return null;

  const followersCount = await this.followRepo.count({ where: { following_id: id } });
  const followingCount = await this.followRepo.count({ where: { follower_id: id } });

  return {
    ...user,
    followersCount,
    followingCount,
  };
}

  async create(userData: Partial<User>): Promise<User> {
    console.log('userData.password', userData.password);
    
    // const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = this.usersRepository.create({
      ...userData,
      // password: hashedPassword,
    });
    return this.usersRepository.save(user);
  }

  async update(id: number, updateData: Partial<User>): Promise<User> {
    await this.usersRepository.update(id, updateData);
    return this.usersRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email } });
  }
}