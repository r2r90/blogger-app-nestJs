import {
  IsDefined,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotBlank } from '../../../common/validators/custom-validators/is-not-blank.validator.';

export class UpdateBlogDto {
  @ApiProperty({
    description: 'Blog name',
    example: 'MyBlog',
  })
  @IsString()
  @MaxLength(15)
  @IsNotEmpty()
  @IsNotBlank({ message: 'Name cannot be empty or contain only whitespace' })
  @IsDefined()
  name: string;

  @ApiProperty({
    description: 'Blog description',
    example: 'test description blog description',
  })
  @IsString()
  @MaxLength(500)
  @IsOptional()
  description: string;

  @ApiProperty({
    description: 'Blog website url',
    example: 'https://your-exemple-blog-url.com',
  })
  @IsString()
  @MaxLength(100)
  @Matches(
    /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
  )
  @IsOptional()
  websiteUrl: string;
}
