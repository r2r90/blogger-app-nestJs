import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Comment } from '../entity/comment.entity';
import { LikeStatus } from '../../post/dto/like-status.dto';

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
  createdAt: Date;
  likesInfo: LikesInfo;
};

export class CommentMapper {
  constructor(@InjectDataSource() protected readonly db: DataSource) {}

  public mapComments(comment: Comment, userId?: string): CommentOutputType {
    const myStatus: LikeStatus =
      !userId || comment.commentLikes.length === 0
        ? LikeStatus.None
        : (comment.commentLikes.find((like) => like.user_id === userId)
            ?.like_status as LikeStatus) || LikeStatus.None;

    return {
      id: comment.id,
      content: comment.content,
      createdAt: comment.created_at,
      commentatorInfo: {
        userId: comment.user_id,
        userLogin: comment.user.login,
      },
      likesInfo: {
        likesCount: comment.commentLikes.filter(
          (like) => like.like_status === LikeStatus.Like,
        ).length,
        dislikesCount: comment.commentLikes.filter(
          (like) => like.like_status === LikeStatus.Dislike,
        ).length,
        myStatus,
      },
    };
  }
}
