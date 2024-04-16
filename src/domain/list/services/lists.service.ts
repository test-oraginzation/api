import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { List } from '../entities/list.entity';

@Injectable()
export class ListsServiceDomain {
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

  async findAllByUserId(userId: number) {
    return await this.listRepository.find({
      where: { user: { id: userId } },
    });
  }

  async findAllListsIdsByUserId(userId: number) {
    const query = this.listRepository
      .createQueryBuilder('list')
      .select('list.id', 'id')
      .where('list.user.id = :userId', { userId: userId });

    return await query.getRawMany();
  }

  async findOne(id: number) {
    return await this.listRepository.findOne({ where: { id: id } });
  }

  async findOneByOwnerId(ownerId: number, id: number) {
    return await this.listRepository.findOne({
      where: { user: { id: ownerId }, id: id },
    });
  }

  async update(list: List) {
    return await this.listRepository.save(list);
  }

  async remove(id: number) {
    return await this.listRepository.delete(id);
  }
}
