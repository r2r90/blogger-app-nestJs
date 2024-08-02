import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
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

  @Put(':id')
  @HttpCode(204)
  update(@Param('id') id: string, @Body() createBlogDto: CreateBlogDto) {
    return this.blogService.updateBlog(id, createBlogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blogService.removeBlog(id);
  }
}
