import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto /createBlog.dto';
import { BlogQueryPipe } from './pipes/blogQuery.pipe';
import { BlogQueryInputModel } from './models/blogQuery.input.model';

@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  create(@Body() blogDto: CreateBlogDto) {
    return this.blogService.createBlog(blogDto);
  }

  @Get()
  @UsePipes(BlogQueryPipe)
  getAll(@Query() query: BlogQueryInputModel) {
    return this.blogService.getAll(query);
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.blogService.getOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string) {}

  @Delete(':id')
  remove(@Param('id') id: string) {}
}
