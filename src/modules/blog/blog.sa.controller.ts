import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PaginationQueryPipe } from '../../common/pipes/paginationQuery.pipe';
import { PaginationInputType } from '../../common/pagination/pagination.types';
import { CreatePostFromBlogDto } from '../post/dto/create.post.from.blog.dto';
import { CommandBus } from '@nestjs/cqrs';
import { CreateBlogCommand } from './commands/impl/create-blog.command';
import { CreatePostCommand } from '../post/commands/impl/create-post.command';
import { SkipThrottle } from '@nestjs/throttler';
import { AuthGuard } from '@nestjs/passport';
import { BlogService } from './blog.service';
import { UserDecorator } from '../../common/decorators/user.decorator';
import { PostService } from '../post/post.service';
import { CreateBlogDto, UpdateBlogDto } from './dto';
import { ApiTags } from '@nestjs/swagger';

@SkipThrottle()
@UseGuards(AuthGuard('basic'))
@Controller('sa/blogs')
@ApiTags('Super-Admin Blog')
export class SuperAdminBlogController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly blogService: BlogService,
    private readonly postService: PostService,
  ) {}

  @Get()
  getAll(@Query(PaginationQueryPipe) query: PaginationInputType) {
    return this.blogService.getAllBlogs(query);
  }

  @Post()
  create(@Body() createBlogDto: CreateBlogDto) {
    const { name, description, websiteUrl } = createBlogDto;
    return this.commandBus.execute(
      new CreateBlogCommand(name, description, websiteUrl),
    );
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return await this.blogService.findBlogById(id);
  }

  @Put(':id')
  @HttpCode(204)
  async update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogService.updateBlog(id, updateBlogDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    return await this.blogService.removeBlog(id);
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

  @Get(':blogId/posts')
  async getPostsByBlogId(
    @UserDecorator('id') userId: string,
    @Param('blogId') blogId: string,
    @Query(PaginationQueryPipe) query: PaginationInputType,
  ) {
    return this.blogService.getPostsByBlogId(query, blogId, userId);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':blogId/posts/:postId')
  updatePost(
    @Param('blogId') blogId: string,
    @Param('postId') postId: string,
    @Body() updatePostData: CreatePostFromBlogDto,
  ) {
    return this.postService.updatePostByBlogId(blogId, postId, updatePostData);
  }

  @Delete(':blogId/posts/:postId')
  @HttpCode(204)
  async removePostByBlogId(
    @Param('blogId') blogId: string,
    @Param('postId') postId: string,
  ) {
    return this.postService.deletePostByBlogId(blogId, postId);
  }
}
