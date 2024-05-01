import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserServiceInterface } from '../typing/interfaces/user.service.interface';

@Injectable()
export class UserServiceDomain implements UserServiceInterface {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(user: User) {
    const newUser = this.userRepository.create(user);
    return await this.userRepository.save(newUser);
  }

  async findOne(id: number) {
    return await this.userRepository.findOne({ where: { id: id } });
  }

  async findByNickname(nickname: string) {
    return await this.userRepository.findOneBy({ nickname: nickname });
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOneBy({ email: email });
  }

  async update(user: User) {
    return await this.userRepository.save(user);
  }

  async remove(id: number) {
    return await this.userRepository.delete(id);
  }
}
