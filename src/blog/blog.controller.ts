import { Controller, Get, Post } from '@nestjs/common';
import { BlogService } from './blog.service';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  create() {
    return this.blogService.create();
  }

  @Get()
  getAll() {
    return 'Hello';
    // return this.blogService.getAll();
  }
}
