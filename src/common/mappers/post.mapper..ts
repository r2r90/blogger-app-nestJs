import { Types } from 'mongoose';
import { PostDocument } from '../schemas/post.schema';

export type PostOutputType = {
  id: Types.ObjectId;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
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
  };
};
