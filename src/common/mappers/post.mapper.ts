import { Types } from 'mongoose';
import { PostDocument } from '../schemas/post.schema';

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

export const postMapper = (post: PostDocument): PostOutputType => {
  return {
    id: post.id,
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    createdAt: post.createdAt,
    blogName: post.blogName,
    blogId: post.blogId,
    extendedLikesInfo: {
      likesCount: 0,
      dislikesCount: 0,
      myStatus: 'None',
      newestLikes: [],
    },
  };
};
