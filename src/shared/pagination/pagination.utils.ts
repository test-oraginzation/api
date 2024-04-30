import { SORT_TYPE } from './sort.enum';
import { IPagination } from './pagination.interface';
import { SelectQueryBuilder } from 'typeorm';

export function applyPaginationParams(
  query: SelectQueryBuilder<any>,
  params: IPagination,
  field: string,
) {
  if (params.limit) {
    const page = params.page || 1;
    const limit = params.limit;
    const offset = (page - 1) * limit;
    query.take(limit).skip(offset);
  }
  if (params.sort) {
    query.orderBy(field, params.sort as SORT_TYPE);
  }
}
