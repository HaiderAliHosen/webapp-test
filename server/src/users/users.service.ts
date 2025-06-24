import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOne(username: string, options?: FindOneOptions<User>): Promise<User | undefined> {
    return this.usersRepository.findOne({ 
      where: { username },
      ...options
    });
  }

  async findById(
    id: number, 
    options?: FindOneOptions<User>
  ): Promise<User | undefined> {
    return this.usersRepository.findOne({
      where: { id },
      ...options
    });
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