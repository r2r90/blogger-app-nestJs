import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
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

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.blogService.getOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string) {
  }

  @Delete(':id')
  remove(@Param('id') id: string) {}
}
