import { SORT_TYPE } from './sort.enum';
import { IPagination } from './pagination.interface';
import { SelectQueryBuilder } from 'typeorm';

export function applyPaginationParams(
  query: SelectQueryBuilder<any>,
  params: IPagination,
  field: string,
) {
  if (params.limit) {
    query.take(params.limit);
  }
  if (params.sort) {
    query.orderBy(field, params.sort as SORT_TYPE);
  }
}
