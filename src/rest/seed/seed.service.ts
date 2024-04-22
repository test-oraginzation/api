import { Injectable } from '@nestjs/common';
import { UserServiceRest } from '../user/user.service';
import { WishServiceRest } from '../wish/wish.service';
import { ListServiceRest } from '../list/list.service';
import { FollowServiceRest } from '../follow/follow.service';

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

      console.log(
        `user ${createdUser.id} with nickname: ${createdUser.nickname} seeded`,
      );

      const createdWish = await this.wishServiceRest.create(createdUser.id, {
        currency: 'USD',
        name: `Wish${i}`,
        price: 20,
      });

      console.log(
        `wish ${createdWish.id} with name: ${createdWish.name} seeded`,
      );

      const createdList = await this.listServiceRest.create(createdUser.id, {
        description: `List${i} description`,
        name: `List${i}`,
      });

      console.log(
        `list ${createdList.id} with name: ${createdList.name} seeded`,
      );

      const wishesInList = await this.listServiceRest.updateWishesInList(
        createdUser.id,
        createdList.id,
        { wishIds: [createdWish.id] },
      );
      console.log(`wishesInList listId ${wishesInList.id}`);
      userIds[i] = createdUser.id;
    }
    const createdFollow = await this.followServiceRest.create(userIds[0], {
      following: userIds[1],
    });

    console.log(
      `created follow ${createdFollow.id} follower ${createdFollow.follower} following ${createdFollow.following}`,
    );
  }
}
