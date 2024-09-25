import {
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
  UseGuards,
} from '@nestjs/common';
import { CreateBlogDto } from './dto/create.blog.dto';
import { PaginationQueryPipe } from '../common/pipes/paginationQuery.pipe';
import { IsObjectIdPipe } from 'nestjs-object-id';
import { PaginationInputType } from '../common/pagination/pagination.types';
import { CreatePostFromBlogDto } from '../post/dto/create.post.from.blog.dto';
import { CommandBus } from '@nestjs/cqrs';
import { CreateBlogCommand } from './commands/impl/create-blog.command';
import { BlogRepository } from './repositories/blog.repository';
import { BlogQueryRepository } from './repositories/blog.query.repository';
import { PostQueryRepository } from '../post/repositories/post-query.repository';
import { CreatePostCommand } from '../post/commands/impl/create-post.command';
import { SkipThrottle } from '@nestjs/throttler';
import { AuthGuard } from '@nestjs/passport';

@SkipThrottle()
@Controller('blogs')
export class BlogController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly blogRepository: BlogRepository,
    private readonly blogQueryRepository: BlogQueryRepository,
    private readonly postQueryRepository: PostQueryRepository,
  ) {}

  @UseGuards(AuthGuard('basic'))
  @Post()
  create(@Body() createBlogDto: CreateBlogDto) {
    const { name, description, websiteUrl } = createBlogDto;
    return this.commandBus.execute(
      new CreateBlogCommand(name, description, websiteUrl),
    );
  }

  @Get()
  getAll(@Query(PaginationQueryPipe) query: PaginationInputType) {
    return this.blogQueryRepository.getAll(query);
  }

  @Get(':id')
  async getOne(@Param('id', IsObjectIdPipe) id: string) {
    return await this.blogQueryRepository.findOne(id);
  }

  @UseGuards(AuthGuard('basic'))
  @Put(':id')
  @HttpCode(204)
  async update(
    @Param('id', IsObjectIdPipe) id: string,
    @Body() createBlogDto: CreateBlogDto,
  ) {
    return this.blogRepository.update(id, createBlogDto);
  }

  @UseGuards(AuthGuard('basic'))
  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', IsObjectIdPipe) id: string) {
    return await this.blogRepository.removeBlog(id);
  }

  @UseGuards(AuthGuard('basic'))
  @Post(':blogId/posts')
  async createPostInBlog(
    @Param('blogId', IsObjectIdPipe) id: string,
    @Body() createPostFromBlogInput: CreatePostFromBlogDto,
  ) {
    const { title, shortDescription, content } = createPostFromBlogInput;
    return await this.commandBus.execute(
      new CreatePostCommand(title, shortDescription, content, id),
    );
  }

  @Get(':blogId/posts')
  async getPostsByBlogId(
    @Param('blogId', IsObjectIdPipe) blogId: string,
    @Query(PaginationQueryPipe) query: PaginationInputType,
  ) {
    const blog = await this.blogQueryRepository.findOne(blogId);
    if (!blog) throw new NotFoundException('Cannot find blog id');
    return await this.postQueryRepository.findPostsByBlogId(blogId, query);
  }
}
