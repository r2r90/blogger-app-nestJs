import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogRepository } from './repositories/blog.repository';
import { CreateBlogDto } from './dto /create.blog.dto';
import { BlogQueryRepository } from './repositories/blog.query.repository';
import { BlogOutputType } from '../common/mappers/blog.mapper';
import {
  PaginationInputType,
  PaginationType,
} from '../common/pagination/pagination.types';

@Injectable()
export class BlogService {
  constructor(
    private readonly blogRepository: BlogRepository,
    private readonly blogQueryRepository: BlogQueryRepository,
  ) {}

  async getAll(
    query: PaginationInputType,
  ): Promise<PaginationType<BlogOutputType>> {
    return this.blogQueryRepository.getAll(query);
  }

  async getOne(id: string): Promise<BlogOutputType> {
    const finded = await this.blogQueryRepository.findOne(id);

    if (!finded) throw new NotFoundException('Cannot find blog by id');
    return finded;
  }

  async createBlog(createBlogDto: CreateBlogDto) {
    return await this.blogRepository.create(createBlogDto);
  }

  async updateBlog(id: string, dataToUpdate: CreateBlogDto) {
    const blogToUpdate = await this.getOne(id);
    if (!blogToUpdate) throw new NotFoundException();
    return this.blogRepository.update(id, dataToUpdate);
  }

  async removeBlog(id: string) {
    const blogToDelete = await this.blogQueryRepository.findOne(id);
    if (!blogToDelete) throw new NotFoundException();
    const isDeleted = await this.blogRepository.removeBlog(id);
    if (!isDeleted) throw new NotFoundException();
    return true;
  }

  async getPostsByBlogId(id: string, query: PaginationInputType) {
    return await this.blogQueryRepository.findPostsByBlogId(id, query);
  }
}
