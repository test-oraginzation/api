import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wish } from '../entities/wish.entity';
import { WishServiceInterface } from '../typing/wish.service.interface';

@Injectable()
export class WishServiceDomain implements WishServiceInterface {
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

  async findOne(id: number) {
    return await this.wishRepository.findOne({ where: { id: id } });
  }

  async findOneByUserId(userId: number, id: number) {
    return await this.wishRepository.findOne({
      where: { user: { id: userId }, id: id },
    });
  }

  async update(wish: Wish) {
    return await this.wishRepository.save(wish);
  }

  async remove(id: number) {
    return await this.wishRepository.delete(id);
  }
}
