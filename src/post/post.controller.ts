import { Body, Controller, Get, Post } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create.post.dto';

@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @Get()
  getAll() {
    return this.postService.getAllPosts();
  }

  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postService.createPost(createPostDto);
  }
}
