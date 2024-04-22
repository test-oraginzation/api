import { InjectRepository } from '@nestjs/typeorm';
import { Follow } from '../entities/follow.entity';
import { Repository } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FollowServiceDomain {
  constructor(
    @InjectRepository(Follow)
    private followRepository: Repository<Follow>,
  ) {}

  async create(follow: Follow) {
    const newFollow = this.followRepository.create(follow);
    return await this.followRepository.save(newFollow);
  }

  async findAll() {
    return await this.followRepository.find();
  }

  async findOne(userId: number) {
    return await this.followRepository.findOne({
      where: { id: userId },
      relations: ['follower'],
    });
  }
  async findFollowers(userId: number): Promise<User[]> {
    const follows: Follow[] = await this.followRepository.find({
      where: {
        follower: { id: userId },
      },
      relations: ['following'],
    });
    return follows.map((follow) => follow.following);
  }

  async countFollowers(userId: number): Promise<number> {
    return await this.followRepository.count({
      where: {
        follower: { id: userId },
      },
    });
  }

  async countFollowing(userId: number): Promise<number> {
    return await this.followRepository.count({
      where: {
        following: { id: userId },
      },
    });
  }

  async remove(id: number) {
    return await this.followRepository.delete(id);
  }
}
