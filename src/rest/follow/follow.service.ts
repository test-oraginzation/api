import { FollowServiceDomain } from '../../domain/follow/services/follow.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserServiceRest } from '../user/user.service';
import { Follow } from '../../domain/follow/entities/follow.entity';
import { CreateFollowDto } from './dto/create-follow.dto';

@Injectable()
export class FollowServiceRest {
  constructor(
    private followServiceDomain: FollowServiceDomain,
    private userServiceRest: UserServiceRest,
  ) {}

  async getAll() {
    return this.followServiceDomain.findAll();
  }

  async delete(userId: number, id: number) {
    const follow: Follow = await this.followServiceDomain.findOne(id);
    if (follow.follower.id !== userId) {
      throw new HttpException(
        `Follow is not yours`,
        HttpStatus.FORBIDDEN,
      );
    }
    return await this.followServiceDomain.remove(id);
  }

  async create(followerId: number, data: CreateFollowDto) {
    const candidate = this.userServiceRest.getOne(followerId);
    if (!candidate) {
      throw new HttpException(`User doesnt exists`, HttpStatus.BAD_REQUEST);
    }
    if (!candidate) {
      throw new HttpException(
        `Following user doesnt exists`,
        HttpStatus.BAD_REQUEST,
      );
    }
    if (data.following || followerId) {
      const follow: Follow = await this.initSubcription(followerId, data);
      return await this.followServiceDomain.create(follow);
    } else {
      throw new HttpException(`All fields required`, HttpStatus.BAD_REQUEST);
    }
  }

  async initSubcription(followerId: number, data: CreateFollowDto) {
    const follower = await this.userServiceRest.getOne(followerId);
    const following = await this.userServiceRest.getOne(data.following);
    const follow: Follow = new Follow();
    follow.follower = follower;
    follow.following = following;
    return follow;
  }

  async getFollowers(userId: number) {
    const user = this.userServiceRest.getOne(userId);
    if (!user) {
      throw new HttpException(`User doesnt exists`, HttpStatus.BAD_REQUEST);
    }
    return await this.followServiceDomain.findFollowers(userId);
  }

  async getFollowing(userId: number) {
    const user = this.userServiceRest.getOne(userId);
    if (!user) {
      throw new HttpException(`User doesnt exists`, HttpStatus.BAD_REQUEST);
    }
    return await this.followServiceDomain.findFollowing(userId);
  }

  async checkFollow(userId: number, following: number) {
    const user = this.userServiceRest.getOne(userId);
    if (!user) {
      throw new HttpException(`User doesnt exists`, HttpStatus.BAD_REQUEST);
    }
    return await this.followServiceDomain.findOne(following);
  }

  async getFollowersCount(userId: number) {
    const user = this.userServiceRest.getOne(userId);
    if (!user) {
      throw new HttpException(`User doesnt exists`, HttpStatus.BAD_REQUEST);
    }
    return await this.followServiceDomain.countFollowers(userId);
  }

  async getFollowingCount(userId: number) {
    const user = this.userServiceRest.getOne(userId);
    if (!user) {
      throw new HttpException(`User doesnt exists`, HttpStatus.BAD_REQUEST);
    }
    return await this.followServiceDomain.countFollowing(userId);
  }
}
