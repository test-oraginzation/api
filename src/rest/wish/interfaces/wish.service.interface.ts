import { IPagination } from '../../../shared/pagination/pagination.interface';
import { CreateWishDto } from '../dto/create-wish.dto';
import { UpdateWishDto } from '../dto/update-wish.dto';
import { Wish } from '../../../domain/wish/entities/wish.entity';
import { CountItemsDto } from '../../../shared/count-items.dto';
import { DeleteResult } from 'typeorm';

export interface WishServiceInterfaceRest {
  getAll(): Promise<Wish[]>;
  getAllByUserId(userId: number, params: IPagination): Promise<CountItemsDto>;
  getOneByUserID(userId: number, id: number): Promise<Wish>;
  create(userId: number, data: CreateWishDto): Promise<Wish>;
  delete(userId: number, id: number): Promise<DeleteResult>;
  updatePhoto(userId: number, wishId: number): Promise<Wish>;
  update(userId: number, id: number, data: UpdateWishDto): Promise<Wish>;
}
