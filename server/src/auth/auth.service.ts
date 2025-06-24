import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entities/user.entity';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from '../dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    // 1. Find user (include password in selection)
    
    const user = await this.usersService.findOne(username, { select: ['id', 'username', 'password', 'email', 'name'] });
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 2. Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 3. Return user without password
    const { password: _, ...result } = user;
    return result;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        avatar_url: user.avatar_url,
      },
    };
  }
  
  async register(registerDto: RegisterDto): Promise<{ access_token: string; user: Omit<User, 'password'> }> {
    // Check for existing username
    const existingUser = await this.usersService.findOne(registerDto.username);
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    // Check for existing email
    const existingEmail = await this.usersService.findByEmail(registerDto.email);
    if (existingEmail) {
      throw new ConflictException('Email already registered');
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    console.log('register hashedPassword', hashedPassword);
    
    const user = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
    });

    // Generate token
    const payload = { username: user.username, sub: user.id };
    const access_token = this.jwtService.sign(payload);

    // Return user data without password
    const { password, ...userData } = user;
    return { access_token, user: userData };
  }

    async getProfile(userId: number) {
        return this.usersService.findById(userId, {
            select: ['id', 'username', 'email', 'name', 'avatar_url']
        });
    }
}