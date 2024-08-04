import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { PaginationInputModel } from '../models/pagination.input.model';

@Injectable()
export class PaginationQueryPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): PaginationInputModel {
    const { searchNameTerm, sortBy, sortDirection, pageNumber, pageSize } =
      value;

    const validSortDirections = ['asc', 'desc'];
    if (
      sortDirection &&
      !validSortDirections.includes(sortDirection.toLowerCase())
    ) {
      throw new BadRequestException(`Invalid sortDirection: ${sortDirection}`);
    }

    return {
      searchNameTerm: searchNameTerm ?? null,
      sortBy: sortBy ?? 'createdAt',
      sortDirection: (sortDirection ?? 'desc').toLowerCase() as 'asc' | 'desc',
      pageNumber: pageNumber ? +pageNumber : 1,
      pageSize: pageSize ? +pageSize : 10,
    };
  }
}