import { Injectable } from '@nestjs/common';
import { BlogRepository } from './repositories/blog.repository';
import { CreateBlogDto } from './dto /createBlog.dto';
import { BlogQueryRepository } from './repositories/blog.query.repository';
import { BlogQueryInputModel } from './models/blogQuery.input.model';

@Injectable()
export class BlogService {
  constructor(
    private readonly blogRepository: BlogRepository,
    private readonly blogQueryRepository: BlogQueryRepository,
  ) {}

  async getAll(query: BlogQueryInputModel) {
    return this.blogQueryRepository.getAll(query);
  }

  async getOne(id: string) {
    return this.blogQueryRepository.findOne(id);
  }

  async createBlog(createBlogDto: CreateBlogDto) {
    const res = await this.blogRepository.create(createBlogDto);
    return res;
  }

  async updateBlog() {}
}
