import { InjectRepository } from '@nestjs/typeorm';
import { Follow } from '../entities/follow.entity';
import { DeleteResult, Repository } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FollowServiceInterface } from '../typing/interfaces/follow.service.interface';

@Injectable()
export class FollowServiceDomain implements FollowServiceInterface {
  constructor(
    @InjectRepository(Follow)
    private followRepository: Repository<Follow>,
  ) {}

  async create(follow: Follow): Promise<Follow> {
    const existingFollow = await this.checkFollow(
      follow.follower.id,
      follow.following.id,
    );
    const newFollow = this.followRepository.create(follow);
    if (existingFollow) {
      throw new HttpException('Follow is already exists', HttpStatus.FORBIDDEN);
    }
    return await this.followRepository.save(newFollow);
  }

  async findAll(): Promise<Follow[]> {
    return await this.followRepository.find();
  }

  async findOne(id: number): Promise<Follow> {
    return await this.followRepository.findOne({
      where: { id: id },
      relations: ['follower'],
    });
  }

  async findFollowing(userId: number): Promise<User[]> {
    const follows: Follow[] = await this.followRepository.find({
      where: {
        follower: { id: userId },
      },
      relations: ['following'],
    });
    return follows.map((follow) => follow.following);
  }

  async findFollowers(userId: number): Promise<User[]> {
    const follows: Follow[] = await this.followRepository.find({
      where: {
        following: { id: userId },
      },
      relations: ['follower'],
    });
    return follows.map((follow) => follow.follower);
  }

  async checkFollow(followerId: number, followingId: number): Promise<Follow> {
    return await this.followRepository.findOne({
      where: { follower: { id: followerId }, following: { id: followingId } },
    });
  }

  async countFollowing(userId: number): Promise<number> {
    return await this.followRepository.count({
      where: {
        follower: { id: userId },
      },
    });
  }

  async countFollowers(userId: number): Promise<number> {
    return await this.followRepository.count({
      where: {
        following: { id: userId },
      },
    });
  }

  async removeByFollowingId(followingId: number): Promise<DeleteResult> {
    return await this.followRepository.delete({
      following: { id: followingId },
    });
  }
}
