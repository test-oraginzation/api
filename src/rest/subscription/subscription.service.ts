import { SubscriptionServiceDomain } from '../../domain/subscription/services/subscription.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { Subscription } from '../../domain/subscription/entities/subscription.entity';
import { UserServiceRest } from '../user/user.service';

@Injectable()
export class SubscriptionServiceRest {
  constructor(
    private subscriptionServiceDomain: SubscriptionServiceDomain,
    private userServiceRest: UserServiceRest,
  ) {}

  async getAll() {
    return this.subscriptionServiceDomain.findAll();
  }

  async delete(userId: number, id: number) {
    const user = this.userServiceRest.getOne(userId);
    if (!user) {
      throw new HttpException(`User doesnt exists`, HttpStatus.BAD_REQUEST);
    }
    const subscription = await this.subscriptionServiceDomain.findOne(id);
    if (subscription.subscriber.id !== userId) {
      throw new HttpException(
        `Subscription is not yours`,
        HttpStatus.FORBIDDEN,
      );
    }
    return await this.subscriptionServiceDomain.remove(id);
  }

  async create(subscriberId: number, data: CreateSubscriptionDto) {
    const candidate = this.userServiceRest.getOne(subscriberId);
    if (!candidate) {
      throw new HttpException(`User doesnt exists`, HttpStatus.BAD_REQUEST);
    }
    if (!candidate) {
      throw new HttpException(
        `SubscribedTo user doesnt exists`,
        HttpStatus.BAD_REQUEST,
      );
    }
    if (data.subscribedToId || subscriberId) {
      const subscription = await this.initSubcription(subscriberId, data);
      return await this.subscriptionServiceDomain.create(subscription);
    } else {
      throw new HttpException(`All fields required`, HttpStatus.BAD_REQUEST);
    }
  }

  async initSubcription(subscriberId: number, data: CreateSubscriptionDto) {
    const subscriber = await this.userServiceRest.getOne(subscriberId);
    const subscribeTo = await this.userServiceRest.getOne(data.subscribedToId);
    const subscription = new Subscription();
    subscription.subscriber = subscriber;
    subscription.subscribedTo = subscribeTo;
    return subscription;
  }

  async getSubscribers(userId: number) {
    const user = this.userServiceRest.getOne(userId);
    if (!user) {
      throw new HttpException(`User doesnt exists`, HttpStatus.BAD_REQUEST);
    }
    return await this.subscriptionServiceDomain.findSubscribers(userId);
  }

  async checkSubscription(userId: number, subscriberId: number) {
    const user = this.userServiceRest.getOne(userId);
    if (!user) {
      throw new HttpException(`User doesnt exists`, HttpStatus.BAD_REQUEST);
    }
    return await this.subscriptionServiceDomain.findOne(subscriberId);
  }
}
