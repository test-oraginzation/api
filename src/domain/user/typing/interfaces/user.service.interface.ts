import { User } from '../../entities/user.entity';
import { DeleteResult } from 'typeorm';

export interface IUserService {
  create(user: User): Promise<User>;
  findOne(id: number): Promise<User>;
  findByNickname(nickname: string): Promise<User>;
  findByEmail(email: string): Promise<User>;
  update(user: User): Promise<User>;
  remove(id: number): Promise<DeleteResult>;
}
