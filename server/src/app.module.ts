import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Murmur } from './entities/murmur.entity';
import { Like } from './entities/like.entity';
import { Follow } from './entities/follow.entity';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MurmursModule } from './murmurs/murmurs.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 3306,
      username: process.env.DB_USERNAME || 'docker',
      password: process.env.DB_PASSWORD || 'docker',
      database: process.env.DB_DATABASE || 'test',
      entities: [User, Murmur, Like, Follow],
      synchronize: true, // Only for development
    }),
    AuthModule,
    UsersModule,
    MurmursModule,
  ],
})
export class AppModule {}
