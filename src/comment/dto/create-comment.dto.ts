import { IsString, MaxLength, MinLength } from 'class-validator';

export type CreateCommentDataType = {
  content: string;
  postId: string;
  userId: string;
  userLogin: string;
};

export type CreatePostDataType = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName?: string;
};

export class CreateCommentDto {
  @IsString()
  @MinLength(20)
  @MaxLength(300)
  content: string;
}
