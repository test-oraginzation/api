import { InjectRepository } from '@nestjs/typeorm';
import { Subscription } from '../entities/subscription.entity';
import { Repository } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SubscriptionServiceDomain {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
  ) {}

  async create(subscription: Subscription) {
    const newSubscription = this.subscriptionRepository.create(subscription);
    return await this.subscriptionRepository.save(newSubscription);
  }

  async findAll() {
    return await this.subscriptionRepository.find();
  }

  async findOne(id: number) {
    return await this.subscriptionRepository.findOne({ where: { id: id } });
  }
  async findSubscribers(userId: number): Promise<User[]> {
    const subscriptions = await this.subscriptionRepository.find({
      where: {
        subscriber: { id: userId },
      },
      relations: ['subscribedTo'],
    });
    return subscriptions.map((subscription) => subscription.subscribedTo);
  }

  async remove(id: number) {
    return await this.subscriptionRepository.delete(id);
  }
}
