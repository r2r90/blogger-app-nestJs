import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PaginationQueryPipe } from '../../common/pipes/paginationQuery.pipe';
import { IsObjectIdPipe } from 'nestjs-object-id';
import { PaginationInputType } from '../../common/pagination/pagination.types';
import { CreatePostFromBlogDto } from '../post/dto/create.post.from.blog.dto';
import { CommandBus } from '@nestjs/cqrs';
import { CreatePostCommand } from '../post/commands/impl/create-post.command';
import { SkipThrottle } from '@nestjs/throttler';
import { BlogService } from './blog.service';
import { UserDecorator } from '../../common/decorators/user.decorator';
import { JwtGuard } from '../auth/guards/jwt-guard';

@SkipThrottle()
@Controller('/blogs')
export class BlogController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly blogService: BlogService,
  ) {}

  @Get()
  getAll(@Query(PaginationQueryPipe) query: PaginationInputType) {
    return this.blogService.getAllBlogs(query);
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return await this.blogService.findBlogById(id);
  }

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
  @UseGuards(JwtGuard)
  async getPostsByBlogId(
    @UserDecorator('userId') userId: string,
    @Param('blogId') blogId: string,
    @Query(PaginationQueryPipe) query: PaginationInputType,
  ) {
    return this.blogService.getPostsByBlogId(query, blogId, userId);
  }
}
