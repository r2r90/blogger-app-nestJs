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
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create.post.dto';
import { PaginationQueryPipe } from '../common/pipes/paginationQuery.pipe';
import { PaginationInputType } from '../common/pagination/pagination.types';
import { IsObjectIdPipe } from 'nestjs-object-id';

@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

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
    return this.postService.createPost(createPostDto);
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
