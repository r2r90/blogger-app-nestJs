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
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetBlogsDto } from './dto/get-blogs.dto';

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
  @ApiOperation({
    summary: 'Get all blogs',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
  })
  @ApiQuery({
    name: 'searchNameTerm',
    type: 'string',
    default: null,
    required: false,
    description:
      'Search term for user: Name should contains this term in any position',
    example: 'find-blog',
  })
  @ApiQuery({
    name: 'sortBy',
    type: 'string',
    default: 'createdAt', // TS2304: Cannot find name createdAt ???
    required: false,
    description: 'Field by which to sort the items',
  })
  @ApiQuery({
    name: 'sortDirection',
    type: 'string',
    default: 'desc',
    required: false,
    enum: ['asc', 'desc'],
    description: 'Field by which to sort the items',
  })
  @ApiQuery({
    name: 'pageNumber',
    type: 'number',
    default: 1,
    required: false,
    description: 'pageNumber is number of items that should be returned',
  })
  @ApiQuery({
    name: 'pageSize',
    type: 'number',
    default: 10,
    required: false,
    description: 'pageSize is quantity size per page that should be returned',
  })
  getAll(@Query() query: GetBlogsDto) {
    return this.blogService.getAllBlogs(query);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new blog',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Returns the newly created blog',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'If the inputModel has incorrect values',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  create(@Body() createBlogDto: CreateBlogDto) {
    const { name, description, websiteUrl } = createBlogDto;
    return this.commandBus.execute(
      new CreateBlogCommand(name, description, websiteUrl),
    );
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update Blog',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'No Content',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'If the inputModel has incorrect values',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  @HttpCode(204)
  async update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogService.updateBlog(id, updateBlogDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Remove Item',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'No Content',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Item Not found',
  })
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    return await this.blogService.removeBlog(id);
  }

  @Post(':blogId/posts')
  @ApiOperation({
    summary: 'Create new post for specific blog',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'No Content',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Blog Not found',
  })
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
  @ApiOperation({
    summary: 'Return posts for blog with paging and sorting',
  })
  async getPostsByBlogId(
    @UserDecorator('id') userId: string,
    @Param('blogId') blogId: string,
    @Query(PaginationQueryPipe) query: PaginationInputType,
  ) {
    return this.blogService.getPostsByBlogId(query, blogId, userId);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':blogId/posts/:postId')
  @ApiOperation({
    summary: 'Update existing post by id with InputModel',
  })
  updatePost(
    @Param('blogId') blogId: string,
    @Param('postId') postId: string,
    @Body() updatePostData: CreatePostFromBlogDto,
  ) {
    return this.postService.updatePostByBlogId(blogId, postId, updatePostData);
  }

  @Delete(':blogId/posts/:postId')
  @ApiOperation({
    summary: 'Delete post specified id',
  })
  @HttpCode(204)
  async removePostByBlogId(
    @Param('blogId') blogId: string,
    @Param('postId') postId: string,
  ) {
    return this.postService.deletePostByBlogId(blogId, postId);
  }

  // @Get(':id')
  // @ApiOperation({
  //   summary: 'Find Blog by ID',
  // })
  // async getOne(@Param('id') id: string) {
  //   return await this.blogService.findBlogById(id);
  // }
}
