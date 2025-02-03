import { Blog } from '../entity/blog.entity';

export type BlogOutputType = {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  websiteUrl: string;
  isMembership: boolean;
};

export const blogMapper = (blog: Blog): BlogOutputType => {
  return {
    id: blog.id,
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.website_url,
    createdAt: blog.created_at,
    isMembership: blog.is_membership,
  };
};
