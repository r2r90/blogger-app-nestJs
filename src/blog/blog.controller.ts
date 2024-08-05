import {
  BadRequestException,
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
import { CreateBlogDto } from './dto /create.blog.dto';
import { PaginationQueryPipe } from '../common/pipes/paginationQuery.pipe';
import mongoose from 'mongoose';
import { IsObjectIdPipe } from 'nestjs-object-id';
import { PaginationInputType } from '../common/pagination/pagination.types';

@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  create(@Body() blogDto: CreateBlogDto) {
    return this.blogService.createBlog(blogDto);
  }

  @Get()
  @UsePipes(PaginationQueryPipe)
  getAll(@Query() query: PaginationInputType) {
    return this.blogService.getAll(query);
  }

  @Get(':id')
  getOne(@Param('id', IsObjectIdPipe) id: string) {
    return this.blogService.getOne(id);
  }

  @Put(':id')
  @HttpCode(204)
  update(
    @Param('id', IsObjectIdPipe) id: string,
    @Body() createBlogDto: CreateBlogDto,
  ) {
    const isValidId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidId) throw new BadRequestException('id is not valid');
    return this.blogService.updateBlog(id, createBlogDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', IsObjectIdPipe) id: string) {
    return this.blogService.removeBlog(id);
  }
}
