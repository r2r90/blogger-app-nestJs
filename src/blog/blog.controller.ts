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
import { PaginationQueryPipe } from '../common/pipes/paginationQuery.pipe';
import { PaginationInputModel } from '../common/models/pagination.input.model';
import { MongoIdValidationPipe } from '../common/pipes/mongoId.validation.pipe';

@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  create(@Body() blogDto: CreateBlogDto) {
    return this.blogService.createBlog(blogDto);
  }

  @Get()
  @UsePipes(PaginationQueryPipe)
  getAll(@Query() query: PaginationInputModel) {
    return this.blogService.getAll(query);
  }

  @Get(':id')
  @UsePipes(MongoIdValidationPipe)
  getOne(@Param('id') id: string) {
    return this.blogService.getOne(id);
  }

  @Put(':id')
  @UsePipes(MongoIdValidationPipe)
  @HttpCode(204)
  update(@Param('id') id: string, @Body() createBlogDto: CreateBlogDto) {
    return this.blogService.updateBlog(id, createBlogDto);
  }

  @Delete(':id')
  @UsePipes(MongoIdValidationPipe)
  remove(@Param('id') id: string) {
    return this.blogService.removeBlog(id);
  }
}
