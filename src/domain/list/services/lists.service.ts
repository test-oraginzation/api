import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { List } from '../entities/list.entity';

@Injectable()
export class ListsService {
  constructor(
    @InjectRepository(List)
    private listRepository: Repository<List>,
  ) {}

  async create(list: List) {
    const newList = this.listRepository.create(list);
    return await this.listRepository.save(newList);
  }

  async findAll() {
    return await this.listRepository.find();
  }

  async findAllByOwnerId(ownerId: number) {
    return await this.listRepository.find({
      where: { owner: { id: ownerId } },
    });
  }

  async findOne(id: number) {
    return await this.listRepository.findOne({ where: { id: id } });
  }

  async findOneByOwnerId(ownerId: number, id: number) {
    return await this.listRepository.findOne({
      where: { owner: { id: ownerId }, id: id },
    });
  }

  // async update(user: User) {
  //   return await this.userRepository.update(user);
  // }

  async remove(id: number) {
    return await this.listRepository.delete(id);
  }
}
