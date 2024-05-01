import { IPagination } from '../../../shared/pagination/pagination.interface';
import { CreateWishDto } from '../dto/create-wish.dto';
import { UpdateWishDto } from '../dto/update-wish.dto';
import { CountItemsDto } from '../../../shared/count-items.dto';
import { Wish } from '../../../domain/wish/entities/wish.entity';
import { DeleteResult } from 'typeorm';

export interface WishControllerInterface {
  create(req: Request, data: CreateWishDto): Promise<Wish>;
  findAll(): Promise<Wish[]>;
  findAllByUserId(req: Request, params?: IPagination): Promise<CountItemsDto>;
  findOneByUserId(req: Request, id: string): Promise<Wish>;
  update(req: Request, id: string, updateUserDto: UpdateWishDto): Promise<Wish>;
  getSignedUrl(id: number, name: string): Promise<{ url: string }>;
  finishUpload(req: Request, id: number): Promise<Wish>;
  remove(req: Request, id: string): Promise<DeleteResult>;
}
