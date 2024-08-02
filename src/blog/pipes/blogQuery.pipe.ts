import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { BlogQueryInputModel } from '../models/blogQuery.input.model';

@Injectable()
export class BlogQueryPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): BlogQueryInputModel {
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
