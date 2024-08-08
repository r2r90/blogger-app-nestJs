import { IsString, MaxLength } from 'class-validator';
import { IsObjectId } from 'nestjs-object-id';
import { CreatePostFromBlogDto } from './create.post.from.blog.dto';

export type PostInputModel = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
};

export class CreatePostDto extends CreatePostFromBlogDto {
  @IsString()
  @MaxLength(30)
  name: string;

  @IsString()
  @MaxLength(100)
  shortDescription: string;

  @IsString()
  @MaxLength(1000)
  content: string;

  @IsString()
  @IsObjectId()
  blogId: string;
}
