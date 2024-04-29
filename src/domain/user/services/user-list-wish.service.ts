import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserListWish } from '../entities/user-list-wish.entity';
@Injectable()
export class UserListWishServiceDomain {
  constructor(
    @InjectRepository(UserListWish)
    private userListWishRepository: Repository<UserListWish>,
  ) {}

  async create(userListWish: UserListWish) {
    const newList = this.userListWishRepository.create(userListWish);
    return await this.userListWishRepository.save(newList);
  }

  async findOneByListId(listId: number) {
    return await this.userListWishRepository.find({
      where: { list: { id: listId } },
    });
  }

  async remove(id: number) {
    return await this.userListWishRepository.delete(id);
  }
}
