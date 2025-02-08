import { IComment } from '../entity/comment.entity';
import { CommentLike } from '../entity/comment-likes.entity';
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
  createdAt: Date;
  likesInfo: LikesInfo;
};

export class CommentMapper {
  public async mapComments(
    comment: IComment,
    userLogin: string,
    userId?: string,
  ): Promise<CommentOutputType> {
    const commentLikes = comment.commentLikes;
    const myStatus: LikeStatus =
      !userId || commentLikes.length === 0
        ? LikeStatus.None
        : (commentLikes.find((like) => like.user_id === userId)
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
        likesCount: commentLikes.filter(
          (like: CommentLike) => like.like_status === LikeStatus.Like,
        ).length,
        dislikesCount: commentLikes.filter(
          (like: CommentLike) => like.like_status === LikeStatus.Dislike,
        ).length,
        myStatus,
      },
    };
  }
}
