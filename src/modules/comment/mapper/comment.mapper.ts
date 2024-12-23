import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Comment } from '../entity/comment.entity';
import { CommentLike } from '../entity/comment_like.entity';
import { LikeStatus } from '../../../db/db-mongo/schemas';

export type LikesInfo = {
  likesCount: number;
  dislikesCount: number;
  myStatus: 'None' | 'Like' | 'Dislike';
};

export type CommentatorInfo = {
  userId: string;
  userLogin: string;
};

export type CommentOutputType = {
  id: string;
  content: string;
  commentatorInfo: CommentatorInfo;
  createdAt: string;
  likesInfo: LikesInfo;
};

export class CommentMapper {
  constructor(@InjectDataSource() protected readonly db: DataSource) {}

  public mapComments(
    comment: Comment,
    commentLikeInfo: CommentLike[],
    userLogin: string,
    userId?: string,
  ): CommentOutputType {
    const myStatus: LikeStatus =
      !userId || commentLikeInfo.length === 0
        ? LikeStatus.None
        : (commentLikeInfo.find((like) => like.user_id === userId)
            ?.like_status as LikeStatus) || LikeStatus.None;

    return {
      id: comment.id,
      content: comment.content,
      createdAt: comment.created_at,
      commentatorInfo: {
        userId: comment.user_id,
        userLogin,
      },
      likesInfo: {
        likesCount: commentLikeInfo.filter(
          (like) => like.like_status === LikeStatus.Like,
        ).length,
        dislikesCount: commentLikeInfo.filter(
          (like) => like.like_status === LikeStatus.Dislike,
        ).length,
        myStatus,
      },
    };
  }
}
