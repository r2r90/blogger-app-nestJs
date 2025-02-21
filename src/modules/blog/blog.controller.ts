import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CreatePostFromBlogDto } from '../post/dto/create.post.from.blog.dto';
import { CommandBus } from '@nestjs/cqrs';
import { CreatePostCommand } from '../post/commands/impl/create-post.command';
import { SkipThrottle } from '@nestjs/throttler';
import { BlogService } from './blog.service';
import { GetBlogsDto } from './dto/get-blogs.dto';

@SkipThrottle()
@Controller('/blogs')
export class BlogController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly blogService: BlogService,
  ) {}

  @Get()
  getAll(@Query() query: GetBlogsDto) {
    return this.blogService.getAllBlogs(query);
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return await this.blogService.findBlogById(id);
  }

  @Post(':blogId/posts')
  async createPostInBlog(
    @Param('blogId') id: string,
    @Body() createPostFromBlogInput: CreatePostFromBlogDto,
  ) {
    const { title, shortDescription, content } = createPostFromBlogInput;
    return await this.commandBus.execute(
      new CreatePostCommand(title, shortDescription, content, id),
    );
  }
}
