import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreatePostDto } from './dto/create.post.dto';
import { PaginationQueryPipe } from '../../common/pipes/paginationQuery.pipe';
import { PaginationInputType } from '../../common/pagination/pagination.types';
import { IsObjectIdPipe } from 'nestjs-object-id';
import { SkipThrottle } from '@nestjs/throttler';
import { CreatePostCommand } from './commands/impl/create-post.command';
import { PostService } from './post.service';
import { LikeStatusDto } from './dto/like-status.dto';
import { UserDecorator } from '../../common/decorators/user.decorator';
import { JwtAccessAuthGuard } from '../auth/guards/jwt-access-auth.guard';
import { JwtGuard } from '../auth/guards/jwt-guard';
import { AuthGuard } from '@nestjs/passport';
import { CreateCommentDto } from '../comment/dto/create-comment.dto';
import { CreateCommentCommand } from '../comment/commands/impl/create-comment.command';
import { ApiTags } from '@nestjs/swagger';

@SkipThrottle()
@Controller('posts')
export class PostController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly postService: PostService,
  ) {}

  @Get()
  @UseGuards(JwtGuard)
  getAll(
    @Query(PaginationQueryPipe) query: PaginationInputType,
    @UserDecorator('userId') userId: string,
  ) {
    return this.postService.getAllPosts(query, userId);
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  getOne(
    @Param('id') id: string,
    @UserDecorator('userId') userId: string | undefined,
  ) {
    return this.postService.getOnePost(id, userId);
  }

  @Post()
  @UseGuards(AuthGuard('basic'))
  create(@Body() createPostDto: CreatePostDto) {
    const { title, shortDescription, content, blogId } = createPostDto;
    return this.commandBus.execute(
      new CreatePostCommand(title, shortDescription, content, blogId),
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard('basic'))
  @Put(':id')
  update(
    @Param('id', IsObjectIdPipe) id: string,
    @Body() updatePostData: CreatePostDto,
  ) {
    return this.postService.updatePost(id, updatePostData);
  }

  @Put(':postId/like-status')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAccessAuthGuard)
  likesStatus(
    @Param('postId') postId: string,
    @UserDecorator('userId') userId: string,
    @Body()
    dto: LikeStatusDto,
  ) {
    return this.postService.likeStatus(userId, postId, dto.likeStatus);
  }

  @Post(':postId/comments')
  @UseGuards(JwtAccessAuthGuard)
  createComment(
    @UserDecorator('userId') userId: string,
    @Param('postId') postId: string,
    @Body() dto: CreateCommentDto,
  ) {
    return this.commandBus.execute(
      new CreateCommentCommand(userId, postId, dto.content),
    );
  }

  @Get(':postId/comments')
  @UseGuards(JwtGuard)
  getPostsComments(
    @Param('postId') postId: string,
    @Query(PaginationQueryPipe) query: PaginationInputType,
    @UserDecorator('userId') userId: string,
  ) {
    return this.postService.getPostComments(postId, query, userId);
  }
}
