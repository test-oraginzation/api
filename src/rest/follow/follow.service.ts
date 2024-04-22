import { FollowServiceDomain } from '../../domain/follow/services/follow.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Follow } from '../../domain/follow/entities/follow.entity';
import { CreateFollowDto } from './dto/create-follow.dto';
import { UserServiceDomain } from '../../domain/user/services/user.service';

@Injectable()
export class FollowServiceRest {
  constructor(
    private followServiceDomain: FollowServiceDomain,
    private userServiceDomain: UserServiceDomain,
  ) {}

  async getAll() {
    return this.followServiceDomain.findAll();
  }

  async delete(userId: number, id: number) {
    const follow: Follow = await this.followServiceDomain.findOne(id);
    if (follow.follower.id !== userId) {
      throw new HttpException(`Follow is not yours`, HttpStatus.FORBIDDEN);
    }
    return await this.followServiceDomain.remove(id);
  }

  async create(followerId: number, data: CreateFollowDto) {
    if (data.following || followerId) {
      const follow: Follow = await this.initSubcription(followerId, data);
      return await this.followServiceDomain.create(follow);
    } else {
      throw new HttpException(`All fields required`, HttpStatus.BAD_REQUEST);
    }
  }

  async getFollowers(userId: number) {
    return await this.followServiceDomain.findFollowers(userId);
  }

  async getFollowersCount(userId: number) {
    return await this.followServiceDomain.countFollowers(userId);
  }

  async getFollowingCount(userId: number) {
    return await this.followServiceDomain.countFollowing(userId);
  }

  async checkFollow(userId: number, following: number) {
    return await this.followServiceDomain.findOne(following);
  }

  private async initSubcription(followerId: number, data: CreateFollowDto) {
    const follower = await this.userServiceDomain.findOne(followerId);
    const following = await this.userServiceDomain.findOne(data.following);
    const follow: Follow = new Follow();
    follow.follower = follower;
    follow.following = following;
    return follow;
  }
}
