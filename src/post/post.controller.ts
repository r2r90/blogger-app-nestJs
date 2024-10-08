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
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreatePostDto } from './dto/create.post.dto';
import { PaginationQueryPipe } from '../common/pipes/paginationQuery.pipe';
import { PaginationInputType } from '../common/pagination/pagination.types';
import { IsObjectIdPipe } from 'nestjs-object-id';
import { SkipThrottle } from '@nestjs/throttler';
import { CreatePostCommand } from './commands/impl/create-post.command';
import { PostService } from './post.service';

@SkipThrottle()
@Controller('posts')
export class PostController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly postService: PostService,
  ) {}

  @Get()
  getAll(@Query(PaginationQueryPipe) query: PaginationInputType) {
    return this.postService.getAllPosts(query);
  }

  @Get(':id')
  getOne(@Param('id', IsObjectIdPipe) id: string) {
    return this.postService.getOnePost(id);
  }

  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    const { title, shortDescription, content, blogId } = createPostDto;
    return this.commandBus.execute(
      new CreatePostCommand(title, shortDescription, content, blogId),
    );
  }

  @Put(':id')
  @HttpCode(204)
  update(
    @Param('id', IsObjectIdPipe) id: string,
    @Body() updatePostData: CreatePostDto,
  ) {
    return this.postService.updatePost(id, updatePostData);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', IsObjectIdPipe) id: string) {
    return this.postService.deletePost(id);
  }
}
