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
import { CreatePostDto } from './dto/create.post.dto';
import { PaginationQueryPipe } from '../common/pipes/paginationQuery.pipe';
import { PaginationInputType } from '../common/pagination/pagination.types';
import { IsObjectIdPipe } from 'nestjs-object-id';
import { CommandBus } from '@nestjs/cqrs';
import { SkipThrottle } from '@nestjs/throttler';
import { CreatePostCommand } from './commands/impl/create-post.command';
import { PostQueryRepository } from './repositories/post-query.repository';
import { PostRepository } from './repositories/post.repository';

@SkipThrottle()
@Controller('posts')
export class PostController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly postQueryRepository: PostQueryRepository,
    private readonly postRepository: PostRepository,
  ) {}

  @Get()
  getAll(@Query(PaginationQueryPipe) query: PaginationInputType) {
    return this.postQueryRepository.getAll(query);
  }

  @Get(':id')
  getOne(@Param('id', IsObjectIdPipe) id: string) {
    return this.postQueryRepository.findOne(id);
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
    return this.postRepository.update(id, updatePostData);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', IsObjectIdPipe) id: string) {
    return this.postRepository.remove(id);
  }
}
