import { IsString, MaxLength, MinLength } from 'class-validator';

export type CreateCommentDataType = {
  content: string;
  postId: string;
  userId: string;
  userLogin: string;
};

export class CreateCommentDto {
  @IsString()
  @MinLength(20)
  @MaxLength(300)
  content: string;
}
