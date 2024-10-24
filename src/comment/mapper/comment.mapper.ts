import { Types } from 'mongoose';
import { LikeStatus } from '../../db/schemas/post-likes.schema';
import { CommentDocument } from '../../db/schemas/comments.schema';
import { CommentLike } from '../../db/schemas/comment-likes.schema';

export type LikeDetails = {
  description?: 'None' | 'Like' | 'Dislike';
  addedAt?: string;
  userId?: string;
  login?: string;
};

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
  id: Types.ObjectId;
  content: string;
  commentatorInfo: CommentatorInfo;
  createdAt: string;
  likesInfo: LikesInfo;
};

export class CommentMapper {
  public mapComments(
    comment: CommentDocument,
    commentLikeInfo: CommentLike[],
    userId?: string,
  ): CommentOutputType {
    const myLike = commentLikeInfo.find((like) => like.userId === userId);

    const myStatus = myLike ? myLike.likeStatus : 'None';



    return {
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      commentatorInfo: {
        userId: comment.commentatorInfo.userId,
        userLogin: comment.commentatorInfo.userLogin,
      },
      likesInfo: {
        likesCount: commentLikeInfo.filter(
          (like) => like.likeStatus === LikeStatus.Like,
        ).length,
        dislikesCount: commentLikeInfo.filter(
          (like) => like.likeStatus === LikeStatus.Dislike,
        ).length,
        myStatus,
      },
    };
  }
}
