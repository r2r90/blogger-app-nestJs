import { Injectable } from '@nestjs/common';
import { BlogRepository } from './repositories/blog.repository';
import { CreateBlogDto } from './dto /createBlog.dto';
import { BlogQueryRepository } from './repositories/blog.query.repository';

@Injectable()
export class BlogService {
  constructor(
    private readonly blogRepository: BlogRepository,
    private readonly blogQueryRepository: BlogQueryRepository,
  ) {}

  async getAll() {
    return this.blogQueryRepository.getAll();
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
