import { IsOptional, IsString, IsIn, IsInt, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetUsersDto {
  @ApiPropertyOptional({
    description: 'Field to sort by',
    default: 'createdAt',
    type: String,
    example: 'createdAt',
  })
  @IsOptional()
  @IsString()
  sortBy: string = 'createdAt'; // Default value: 'createdAt'

  @ApiPropertyOptional({
    description: 'Sort direction',
    default: 'desc',
    enum: ['asc', 'desc'],
    example: 'desc',
  })
  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'], { message: 'sortDirection must be "asc" or "desc"' })
  sortDirection: string = 'desc'; // Default value: 'desc'

  @ApiPropertyOptional({
    description: 'Page number to return',
    default: 1,
    type: Number,
    example: 1,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10)) // Transform query string to number
  @IsInt({ message: 'pageNumber must be an integer' })
  @Min(1, { message: 'pageNumber must be greater than or equal to 1' })
  pageNumber: number = 1; // Default value: 1

  @ApiPropertyOptional({
    description: 'Number of items per page',
    default: 10,
    type: Number,
    example: 10,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10)) // Transform query string to number
  @IsInt({ message: 'pageSize must be an integer' })
  @Min(1, { message: 'pageSize must be greater than or equal to 1' })
  pageSize: number = 10; // Default value: 10

  @ApiPropertyOptional({
    description: 'Search term for user login (partial match)',
    default: null,
    type: String,
    example: 'john',
  })
  @IsOptional()
  @IsString()
  searchLoginTerm?: string | null = null; // Default value: null

  @ApiPropertyOptional({
    description: 'Search term for user email (partial match)',
    default: null,
    type: String,
    example: 'example@example.com',
  })
  @IsOptional()
  @IsString()
  searchEmailTerm?: string | null = null; // Default value: null
}
