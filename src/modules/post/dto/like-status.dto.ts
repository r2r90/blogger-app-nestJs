import { IsEnum, IsNotEmpty } from 'class-validator';

export type LikePostStatusInputDataType = {
  userId: string;
  postId: string;
  likeStatus: LikeStatus;
};

export type LikeCommentStatusInputDataType = {
  userId: string;
  commentId: string;
  likeStatus: LikeStatus;
};

export enum LikeStatus {
  Like = 'Like',
  Dislike = 'Dislike',
  None = 'None',
}

export class LikeStatusDto {
  @IsNotEmpty()
  @IsEnum(LikeStatus)
  public readonly likeStatus: LikeStatus;
}
