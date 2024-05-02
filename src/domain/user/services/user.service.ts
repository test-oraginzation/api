import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IUserService } from '../typing/interfaces/user.service.interface';
import { Events } from '../../../shared/events/typing/enums/event.enum';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class UserServiceDomain implements IUserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private eventsEmitter: EventEmitter2,
  ) {}

  async create(user: User) {
    const newUser = this.userRepository.create(user);
    const createdUser = await this.userRepository.save(newUser);
    try {
      this.eventsEmitter.emit(Events.onUserCreated, { userId: createdUser.id });
    } catch (e) {}
    return createdUser;
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
