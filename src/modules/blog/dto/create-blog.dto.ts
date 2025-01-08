import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';
import { IsNotBlank } from '../../../common/validators/custom-validators/is-not-blank.validator.';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBlogDto {
  @ApiProperty({
    description: 'Blog name',
    example: 'MyBlog',
  })
  @IsString()
  @MaxLength(15)
  @IsNotEmpty()
  @IsNotBlank({ message: 'Name cannot be empty or contain only whitespace' })
  name: string;

  @ApiProperty({
    description: 'Blog description',
    example: 'test description blog description',
  })
  @IsString()
  @MaxLength(500)
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
  websiteUrl: string;
}
