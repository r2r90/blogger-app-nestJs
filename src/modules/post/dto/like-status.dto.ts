import { IsEnum, IsNotEmpty } from 'class-validator';
import { LikeStatus } from '../../../db/db-mongo/schemas';

export type LikePostStatusInputDataType = {
  userId: string;
  login: string;
  postId: string;
  likeStatus: LikeStatus;
};

export type LikeCommentStatusInputDataType = {
  userId: string;
  login: string;
  commentId: string;
  likeStatus: LikeStatus;
};

export class LikeStatusDto {
  @IsNotEmpty()
  @IsEnum(LikeStatus)
  public readonly likeStatus: LikeStatus;
}
