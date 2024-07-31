import { Injectable } from '@nestjs/common';
import { BlogRepository } from './repositories/blog.repository';
import { CreateBlogDto } from './dto /createBlog.dto';

@Injectable()
export class BlogService {
  constructor(private blogRepository: BlogRepository) {}

  async createBlog(createBlogDto: CreateBlogDto) {
    return this.blogRepository.create(createBlogDto);
  }

  async getAll() {
    return 'this is service return all blogs';
  }
}
