import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Murmur } from '../entities/murmur.entity';
import { User } from '../entities/user.entity';
import { Like } from '../entities/like.entity';
import { MurmursService } from './murmurs.service';
import { MurmursController } from './murmurs.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Murmur, User, Like]), // Add all required entities
    AuthModule,
  ],
  providers: [MurmursService],
  controllers: [MurmursController],
})
export class MurmursModule {}