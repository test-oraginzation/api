import { IPagination } from '../../../../shared/pagination/pagination.interface';
import { CountItemsDto } from '../../../../shared/count-items.dto';
import { CreateUserDto } from '../../dto/create-user.dto';
import { User } from '../../../../domain/user/entities/user.entity';
import { UpdateUserDto } from '../../dto/update-user.dto';

export interface UserServiceInterfaceRest {
  getAll(params: IPagination): Promise<CountItemsDto>;
  getOne(id: number): Promise<User>;
  findByNickname(nickname: string): Promise<User>;
  findByEmail(email: string): Promise<User>;
  create(data: CreateUserDto): Promise<User>;
  delete(id: number): Promise<string>;
  updatePassword(userId: number, password: string): Promise<User>;
  update(id: number, data: UpdateUserDto): Promise<User>;
  updatePhoto(userId: number): Promise<User>;
  getLogs(userId: number): Promise<string[]>;
}
