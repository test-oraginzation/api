import { FollowServiceDomain } from '../../domain/follow/services/follow.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Follow } from '../../domain/follow/entities/follow.entity';
import { CreateFollowDto } from './dto/create-follow.dto';
import { UserServiceDomain } from '../../domain/user/services/user.service';
import { LoggerService, LogLevel } from '../../shared/logger/logger.service';

@Injectable()
export class FollowServiceRest {
  constructor(
    private followServiceDomain: FollowServiceDomain,
    private userServiceDomain: UserServiceDomain,
    private logger: LoggerService,
  ) {}

  async getAll() {
    return this.followServiceDomain.findAll();
  }

  async delete(userId: number, followingId: number) {
    await this.followServiceDomain.removeByFollowingId(followingId);
    await this.logger.log(
      `deleted user's follow: ${followingId}`,
      userId,
      LogLevel.INFO,
    );
    return `Successfully deleted following ${followingId}`;
  }

  async create(followerId: number, data: CreateFollowDto) {
    if (data.following || followerId) {
      const follow: Follow = await this.initSubcription(followerId, data);
      const createdFollow = await this.followServiceDomain.create(follow);
      await this.logger.log(
        `follow created: ${follow.following.id}`,
        followerId,
        LogLevel.INFO,
      );
      return createdFollow;
    } else {
      throw new HttpException(`All fields required`, HttpStatus.BAD_REQUEST);
    }
  }

  async getFollowing(userId: number) {
    return await this.followServiceDomain.findFollowing(userId);
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

  async checkFollow(following: number) {
    const result = await this.followServiceDomain.findOne(following);
    if (result) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return result;
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
