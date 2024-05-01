import {
  ListWishDto,
  UpdateListDto,
  UpdateWishesInListDto,
} from '../dto/list.dto';
import { IPagination } from '../../../shared/pagination/pagination.interface';
import { List } from '../../../domain/list/entities/list.entity';
import { CountItemsDto } from '../../../shared/count-items.dto';

export interface ListServiceInterfaceRest {
  getAll(): Promise<List[]>;
  create(userId: number, data: ListWishDto): Promise<List>;
  getAllByUserId(userId: number, params: IPagination): Promise<CountItemsDto>;
  getOneByUserID(userId: number, id: number): Promise<ListWishDto>;
  updateList(userId: number, id: number, data: UpdateListDto): Promise<List>;
  updateWishesInList(
    userId: number,
    listId: number,
    data: UpdateWishesInListDto,
  ): Promise<ListWishDto>;
  updatePhoto(userId: number, listId: number): Promise<List>;

  delete(userId: number, id: number): Promise<string>;
}
