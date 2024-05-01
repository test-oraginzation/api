import {
  CreateListDto,
  ListWishDto,
  UpdateListDto,
  UpdateWishesInListDto,
} from '../dto/list.dto';
import { IPagination } from '../../../shared/pagination/pagination.interface';
import { List } from '../../../domain/list/entities/list.entity';

export interface ListControllerInterface {
  create(req: Request, data: CreateListDto): Promise<List>;
  findAllByUserId(
    req: Request,
    params: IPagination,
  ): Promise<any[] | { count: number; items: ListWishDto[] }>;
  findOneByUserId(req: Request, id: string): Promise<ListWishDto>;
  update(req: Request, id: string, data: UpdateListDto): Promise<List>;
  updateWishes(
    req: Request,
    id: string,
    data: UpdateWishesInListDto,
  ): Promise<ListWishDto>;
  remove(req: Request, id: string): Promise<string>;
  findAll(): Promise<List[]>;
  getSignedUrl(id: number, name: string): Promise<{ url: string }>;
  finishUpload(req: Request, id: number): Promise<List>;
}
