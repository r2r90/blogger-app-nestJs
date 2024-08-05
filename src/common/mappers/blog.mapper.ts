import { Types } from 'mongoose';
import { BlogDocument } from '../schemas/blog.schema';

export type BlogOutputType = {
  id: Types.ObjectId;
  name: string;
  description: string;
  createdAt: string;
  websiteUrl: string;
  isMembership: boolean;
};

export const blogMapper = (blog: BlogDocument): BlogOutputType => {
  return {
    id: blog.id,
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    createdAt: blog.createdAt,
    isMembership: blog.isMembership,
  };
};
