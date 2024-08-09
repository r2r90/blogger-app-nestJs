import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto /create.blog.dto';
import { PaginationQueryPipe } from '../common/pipes/paginationQuery.pipe';
import mongoose from 'mongoose';
import { IsObjectIdPipe } from 'nestjs-object-id';
import { PaginationInputType } from '../common/pagination/pagination.types';
import { PostService } from '../post/post.service';
import { CreatePostFromBlogDto } from '../post/dto/create.post.from.blog.dto';

@Controller('blogs')
export class BlogController {
  constructor(
    private readonly blogService: BlogService,
    private readonly postService: PostService,
  ) {}

  @Post()
  create(@Body() blogDto: CreateBlogDto) {
    return this.blogService.createBlog(blogDto);
  }

  @Get()
  getAll(@Query(PaginationQueryPipe) query: PaginationInputType) {
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

  @Post(':blogId/posts')
  async createPostInBlog(
    @Param('blogId', IsObjectIdPipe) id: string,
    @Body() createPostFromBlogInput: CreatePostFromBlogDto,
  ) {
    const blogToGet = await this.blogService.getOne(id);

    if (!blogToGet)
      throw new NotFoundException(
        'Blog not found, please check blogId and try again',
      );

    const createPostFromBlogData = { ...createPostFromBlogInput, blogId: id };
    return await this.postService.createPost(createPostFromBlogData);
  }

  @Get(':blogId/posts')
  async getPostsByBlogId(
    @Param('blogId', IsObjectIdPipe) blogId: string,
    @Query(PaginationQueryPipe) query: PaginationInputType,
  ) {
    const blogToGet = await this.blogService.getOne(blogId);
    if (!blogToGet)
      throw new NotFoundException(
        'Blog not found, please check blogId and try again',
      );
    const foundedPosts = await this.blogService.getPostsByBlogId(blogId, query);
    if (!foundedPosts) throw new NotFoundException('No posts found');
    return foundedPosts;
  }
}
