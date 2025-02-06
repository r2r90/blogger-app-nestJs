import { IsNotEmpty, IsString, MaxLength, Validate } from 'class-validator';
import { IsObjectId } from 'nestjs-object-id';
import { CreatePostFromBlogDto } from './create.post.from.blog.dto';
import { BlogIdValidator } from '../../../common/validators/custom-validators/blog-id.validator';
import { IsNotBlank } from '../../../common/validators/custom-validators/is-not-blank.validator.';

export type PostInputModel = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
};

export type CreatePostDataType = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
};

export class CreatePostDto extends CreatePostFromBlogDto {
  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  @IsNotBlank()
  title: string;

  @IsString()
  @MaxLength(100)
  @IsNotBlank()
  shortDescription: string;

  @IsString()
  @IsNotEmpty()
  @IsNotBlank()
  @MaxLength(1000)
  content: string;

  @IsObjectId()
  @IsString()
  @IsNotEmpty()
  @Validate(BlogIdValidator)
  blogId: string;
}
