import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { PaginationInputType } from '../pagination/pagination.types';

@Injectable()
export class PaginationQueryPipe implements PipeTransform {
  transform(value: any): PaginationInputType {
    const {
      searchNameTerm,
      searchLoginTerm,
      searchEmailTerm,
      sortBy,
      sortDirection,
      pageNumber,
      pageSize,
    } = value;

    const validSortDirections = ['asc', 'desc'];
    if (
      sortDirection &&
      !validSortDirections.includes(sortDirection.toLowerCase())
    ) {
      throw new BadRequestException(`Invalid sortDirection: ${sortDirection}`);
    }

    return {
      searchNameTerm: searchNameTerm ?? null,
      searchLoginTerm: searchLoginTerm ?? null,
      searchEmailTerm: searchEmailTerm ?? null,
      sortBy: sortBy ?? 'created_at',
      sortDirection: (sortDirection ?? 'desc').toLowerCase() as 'asc' | 'desc',
      pageNumber: pageNumber ? +pageNumber : 1,
      pageSize: pageSize ? +pageSize : 10,
    };
  }
}
