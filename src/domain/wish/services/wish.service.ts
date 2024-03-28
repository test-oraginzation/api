import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wish } from '../entities/wish.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
  ) {}

  async create(wish: Wish) {
    const newWish = this.wishRepository.create(wish);
    return await this.wishRepository.save(newWish);
  }

  async findAll() {
    return await this.wishRepository.find();
  }

  async findAllByUserId(userId: number) {
    return await this.wishRepository.find({ where: { user: { id: userId } } });
  }

  async findOne(id: number) {
    return await this.wishRepository.findOne({ where: { id: id } });
  }

  // async update(user: User) {
  //   return await this.userRepository.update(user);
  // }

  async remove(id: number) {
    return await this.wishRepository.delete(id);
  }
}
