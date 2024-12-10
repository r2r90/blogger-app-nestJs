import { Types } from 'mongoose';
import { PostDocument } from '../../../db/db-mongo/schemas/post.schema';
import {
  LikeStatus,
  PostLike,
} from '../../../db/db-mongo/schemas/post-likes.schema';

export type LikeDetails = {
  description?: 'None' | 'Like' | 'Dislike';
  addedAt?: string;
  userId?: string;
  login?: string;
};

export type NewestLikes = LikeDetails[];

export type ExtendedLikesInfo = {
  likesCount: number;
  dislikesCount: number;
  myStatus: 'None' | 'Like' | 'Dislike';
  newestLikes: NewestLikes;
};

export type PostOutputType = {
  id: Types.ObjectId;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: ExtendedLikesInfo;
};

export class PostMapper {
  public mapPost(
    post: PostDocument,
    postLikesInfo: PostLike[],
    userId?: string,
  ): PostOutputType {
    const myLike = postLikesInfo.find((like) => like.userId === userId);
    const myStatus = myLike ? myLike.likeStatus : 'None';

    const newestLikes: NewestLikes = postLikesInfo
      .filter((like) => like.likeStatus === 'Like')
      .sort(
        (a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime(),
      )
      .slice(0, 3)
      .map((like) => ({
        addedAt: like.addedAt,
        userId: like.userId,
        login: like.login,
      }));

    return {
      id: post.id,
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      createdAt: post.createdAt,
      blogName: post.blogName,
      blogId: post.blogId,
      extendedLikesInfo: {
        likesCount: postLikesInfo.filter(
          (like) => like.likeStatus === LikeStatus.Like,
        ).length,
        dislikesCount: postLikesInfo.filter(
          (like) => like.likeStatus === LikeStatus.Dislike,
        ).length,
        myStatus,
        newestLikes,
      },
    };
  }
}
