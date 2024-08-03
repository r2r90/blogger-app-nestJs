import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogRepository } from './repositories/blog.repository';
import { CreateBlogDto } from './dto /createBlog.dto';
import { BlogQueryRepository } from './repositories/blog.query.repository';
import { PaginationInputModel } from '../common/models/pagination.input.model';
import { BlogPaginationType } from '../mapper/blog.mapper';
import { Blog } from './schemas/blog.schema';

@Injectable()
export class BlogService {
  constructor(
    private readonly blogRepository: BlogRepository,
    private readonly blogQueryRepository: BlogQueryRepository,
  ) {}

  async getAll(query: PaginationInputModel): Promise<BlogPaginationType<Blog>> {
    return this.blogQueryRepository.getAll(query);
  }

  async getOne(id: string) {
    const finded = await this.blogQueryRepository.findOne(id);
    if (!finded) throw new NotFoundException();
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
    const isDeleted = await this.blogRepository.removeBlog(id);
    if (!isDeleted) throw new NotFoundException();
    return true;
  }
}
