import { BlogDocument } from '../schemas/blog.schema';

export type BlogOutputType = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  websiteUrl: string;
  isMembership: boolean;
};

export type BlogPaginationType<I> = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: I[];
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
