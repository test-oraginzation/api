import { Injectable } from '@nestjs/common';
import { UserServiceRest } from '../../rest/user/user.service';
import { WishServiceRest } from '../../rest/wish/wish.service';
import { ListServiceRest } from '../../rest/list/list.service';
import { FollowServiceRest } from '../../rest/follow/follow.service';

@Injectable()
export class SeedService {
  constructor(
    private readonly userServiceRest: UserServiceRest,
    private readonly wishServiceRest: WishServiceRest,
    private readonly listServiceRest: ListServiceRest,
    private readonly followServiceRest: FollowServiceRest,
  ) {}

  async seed() {
    const userIds: number[] = [];
    for (let i = 0; i < 2; i++) {
      const createdUser = await this.userServiceRest.create({
        nickname: `user${i}`,
        password: process.env.SEED_USER_PASS + `${i}`,
        email: `user${i}@example.com`,
      });

      const createdWish = await this.wishServiceRest.create(createdUser.id, {
        currency: 'USD',
        name: `Wish${i}`,
        price: 20,
      });

      const createdList = await this.listServiceRest.create(createdUser.id, {
        description: `List${i} description`,
        name: `List${i}`,
      });

      await this.listServiceRest.updateWishesInList(
        createdUser.id,
        createdList.id,
        { wishIds: [createdWish.id] },
      );
      userIds[i] = createdUser.id;
    }
    await this.followServiceRest.create(userIds[0], {
      following: userIds[1],
    });
  }
}
