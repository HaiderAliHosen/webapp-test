import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThan, LessThan } from 'typeorm';
import { Murmur } from '../entities/murmur.entity';
import { User } from '../entities/user.entity';
import { PaginationDto } from '../dto/pagination.dto';
import { CreateMurmurDto } from '../dto/create-murmur.dto';
import { Like } from '../entities/like.entity';

@Injectable()
export class MurmursService {
  constructor(
    @InjectRepository(Murmur)
    private murmursRepository: Repository<Murmur>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Like)
    private likesRepository: Repository<Like>,
  ) {}

  async getTimeline(pagination: PaginationDto) {
    const page = Number(pagination?.page) || 1;
    const limit = Number(pagination?.limit) || 10;
    const skip = (page - 1) * limit;

    // return this.murmursRepository.find({
    //   relations: {
    //     user: true,
    //     likes: {
    //       user: true  // This ensures the user relation within likes is loaded
    //     }
    //   },
    //   order: { created_at: 'DESC' },
    //   skip,
    //   take: limit,
    // });
    const results = await this.murmursRepository.find({
      relations: {
        user: true,
        likes: {
          user: true  // This ensures the user relation within likes is loaded
        }
      },
      order: { created_at: 'DESC' },
      skip,
      take: limit,
    });
    console.log('Loaded relations:', results); // Check first murmur's likes
    return results;
  }

  async create(userId: number, createMurmurDto: CreateMurmurDto) {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error('User not found');
    }

    const murmur = this.murmursRepository.create({
      ...createMurmurDto,
      user,
      user_id: userId,
    });

    return this.murmursRepository.save(murmur);
  }

  async delete(murmurId: number, userId: number) {
    // First delete all likes associated with this murmur
    await this.likesRepository.delete({ murmur_id: murmurId });
    
    // Then delete the murmur
    const murmur = await this.murmursRepository.findOne({
      where: { id: murmurId },
      relations: ['user']
    });

    if (!murmur) {
      throw new Error('Murmur not found');
    }

    if (murmur.user.id !== userId) {
      throw new Error('Unauthorized to delete this murmur');
    }

    return this.murmursRepository.remove(murmur);
  }

  async getUserMurmurs(userId: number, pagination: PaginationDto) {
    const page = Number(pagination?.page) || 1;
    const limit = Number(pagination?.limit) || 10;
    const skip = (page - 1) * limit;

    const murmurs = await this.murmursRepository.find({
      where: { user: { id: userId } },
      relations: {
        user: true,
        likes: {
          user: true
        }
      },
      order: { created_at: 'DESC' },
      skip,
      take: limit,
    });

    // Process each murmur to add likeCount and isLiked
    const processedMurmurs = murmurs.map(murmur => ({
      ...murmur,
      likeCount: murmur.likes?.length || 0,
      isLiked: userId 
        ? murmur.likes?.some(like => like.user_id === userId) 
        : false
    }));

    return processedMurmurs;
  }

  async likeMurmur(murmurId: number, userId: number) {
    // Check if murmur exists
    const murmur = await this.murmursRepository.findOneBy({ id: murmurId });
    if (!murmur) {
      throw new Error('Murmur not found');
    }

    // Check if already liked
    const existingLike = await this.likesRepository.findOneBy({
      user_id: userId,
      murmur_id: murmurId
    });

    if (existingLike) {
      await this.likesRepository.remove(existingLike);
    } else {
      const like = this.likesRepository.create({
        user_id: userId,
        murmur_id: murmurId
      });
      await this.likesRepository.save(like);
    }

    // Get updated murmur with relations
    const updatedMurmur = await this.murmursRepository.findOne({
      where: { id: murmurId },
      relations: ['user', 'likes', 'likes.user']
    });

    // Calculate like count and isLiked status
    const likeCount = updatedMurmur.likes?.length || 0;
    const isLiked = updatedMurmur.likes?.some(like => like.user_id === userId) || false;

    return {
      ...updatedMurmur,
      likeCount,
      isLiked
    };
  }

  async unlikeMurmur(murmurId: number, userId: number) {
    const like = await this.likesRepository.findOneBy({
      user_id: userId,
      murmur_id: murmurId,
    });

    if (!like) {
      throw new Error('Like not found');
    }

     await this.likesRepository.remove(like);
    
    // Return the full murmur with updated likes
    return this.murmursRepository.findOne({
      where: { id: murmurId },
      relations: ['user', 'likes', 'likes.user'],
    });
  }

  async getMurmurWithLikeStatus(murmurId: number, userId?: number) {
    const murmur = await this.murmursRepository.findOne({
      where: { id: murmurId },
      relations: ['user', 'likes', 'likes.user'],
    });

    if (!murmur) {
      throw new Error('Murmur not found');
    }

    const response = {
      ...murmur,
      isLiked: false,
      likeCount: murmur.likes?.length || 0,
    };

    if (userId) {
      const userLike = await this.likesRepository.findOneBy({
        user_id: userId,
        murmur_id: murmurId,
      });
      response.isLiked = !!userLike;
    }

    return response;
  }
}