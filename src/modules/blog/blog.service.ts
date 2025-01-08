import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogRepository } from './repositories/blog.repository';
import { BlogQueryRepository } from './repositories/blog.query.repository';
import { BlogOutputType } from './mapper/blog.mapper';
import {
  PaginationInputType,
  PaginationType,
} from '../../common/pagination/pagination.types';
import { PostQueryRepository } from '../post/repositories/post-query.repository';
import { CreatePostFromBlogDto } from '../post/dto/create.post.from.blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

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
    const blog = await this.blogQueryRepository.findOne(id);
    if (!blog) {
      throw new NotFoundException(`Blog with id -  ${id} not found`);
    }
    return blog;
  }

  async removeBlog(id: string) {
    return this.blogRepository.removeBlog(id);
  }

  async updateBlog(id: string, update: UpdateBlogDto): Promise<any> {
    return this.blogRepository.updateBlog(id, update);
  }

  async updatePost(
    blogId: string,
    postId: string,
    data: CreatePostFromBlogDto,
  ) {
    // return this.blogRepository.updatePost(blogId, postId, data);
  }

  async getPostsByBlogId(
    query: PaginationInputType,
    blogId: string,
    userId?: string,
  ) {
    const blog = await this.blogQueryRepository.findOne(blogId);
    if (!blog)
      throw new NotFoundException(`Blog with id -  ${blogId} not found`);
    return await this.postQueryRepository.getPostsByBlogId(
      query,
      blogId,
      userId,
    );
  }
}
