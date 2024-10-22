import { IsEnum, IsNotEmpty } from 'class-validator';
import { LikeStatus } from '../../db/schemas/post.schema';

export type LikeStatusInputDataType = {
  userId: string;
  login: string;
  postId: string;
  likeStatus: LikeStatus;
};

export class LikeStatusDto {
  @IsNotEmpty()
  @IsEnum(LikeStatus)
  public readonly likeStatus: LikeStatus;
}
