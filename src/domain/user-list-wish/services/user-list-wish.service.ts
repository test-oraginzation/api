import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserListWish } from '../entities/user-list-wish.entity';
import { Wish } from '../../wish/entities/wish.entity';
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

  async findAll() {
    return await this.userListWishRepository.find();
  }

  async findAllListsByUserId(userId: number) {
    return await this.userListWishRepository.find({
      where: { user: { id: userId } },
      relations: ['list', 'wish'],
    });
  }

  async findUserListWishes(listId: number, userId: number) {
    return await this.userListWishRepository.find({
      where: { list: { id: listId }, user: { id: userId } },
      relations: ['wish'],
    });
  }

  async findOne(id: number) {
    return await this.userListWishRepository.findOne({ where: { id: id } });
  }

  async findWishesInListByListId(listId: number): Promise<Wish[]> {
    const userWishLists = await this.userListWishRepository.find({
      where: { list: { id: listId } },
      relations: ['wish'],
    });

    return userWishLists.map((userWish) => userWish.wish);
  }

  async findOneByUserId(listId: number) {
    return await this.userListWishRepository.find({
      where: { list: { id: listId } },
    });
  }

  async update(userListWish: UserListWish) {
    return await this.userListWishRepository.save(userListWish);
  }

  async remove(id: number) {
    return await this.userListWishRepository.delete(id);
  }
}
