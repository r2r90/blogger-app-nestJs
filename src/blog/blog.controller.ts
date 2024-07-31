import { Body, Controller, Get, Post } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto /createBlog.dto';

@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  create(@Body() blogDto: CreateBlogDto) {
    return this.blogService.createBlog(blogDto);
  }

  @Get()
  getAll() {
    return this.blogService.getAll();
  }
}
