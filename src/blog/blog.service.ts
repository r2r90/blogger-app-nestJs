import { Injectable } from '@nestjs/common';
import { BlogRepository } from './repositories/blog.repository';
import { BlogQueryRepository } from './repositories/blog.query.repository';
import { BlogOutputType } from './mapper/blog.mapper';
import {
  PaginationInputType,
  PaginationType,
} from '../common/pagination/pagination.types';
import { PostQueryRepository } from '../post/repositories/post-query.repository';
import { CreateBlogDto } from './dto/create.blog.dto';

@Injectable()
export class BlogService {
  constructor(
    private readonly blogRepository: BlogRepository,
    private readonly blogQueryRepository: BlogQueryRepository,
    private readonly postQueryRepository: PostQueryRepository,
  ) {}

  async getAllBlogs(
    query: PaginationInputType,
  ): Promise<PaginationType<BlogOutputType>> {
    return this.blogQueryRepository.getAll(query);
  }

  async findBlogById(id: string): Promise<BlogOutputType> {
    return this.blogQueryRepository.findOne(id);
  }

  async removeBlog(id: string) {
    return this.blogRepository.removeBlog(id);
  }

  async updateBlog(id: string, update: CreateBlogDto): Promise<any> {
    return this.blogRepository.update(id, update);
  }

  async getPostsByBlogId(
    id: string,
    query: PaginationInputType,
    userId?: string,
  ) {
    await this.blogQueryRepository.findOne(id);
    return await this.postQueryRepository.findPostsByBlogId(id, query, userId);
  }
}
