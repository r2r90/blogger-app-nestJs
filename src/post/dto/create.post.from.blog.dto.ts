import { IsString, MaxLength } from 'class-validator';

export type PostInputModel = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
};

export class CreatePostFromBlogDto {
  @IsString()
  @MaxLength(30)
  title: string;

  @IsString()
  @MaxLength(100)
  shortDescription: string;

  @IsString()
  @MaxLength(1000)
  content: string;
}
