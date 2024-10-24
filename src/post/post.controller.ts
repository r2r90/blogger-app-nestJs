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
import { CommandBus } from '@nestjs/cqrs';
import { CreatePostDto } from './dto/create.post.dto';
import { PaginationQueryPipe } from '../common/pipes/paginationQuery.pipe';
import { PaginationInputType } from '../common/pagination/pagination.types';
import { IsObjectIdPipe } from 'nestjs-object-id';
import { SkipThrottle } from '@nestjs/throttler';
import { CreatePostCommand } from './commands/impl/create-post.command';
import { PostService } from './post.service';
import { LikeStatusDto } from './dto/like-status.dto';
import { UserDecorator } from '../common/decorators/user.decorator';
import { CookieDecorator } from '../common/decorators/cookieDecorator';
import { JwtAccessAuthGuard } from '../auth/guards/jwt-access-auth.guard';
import { JwtGuard } from '../auth/guards/jwt-guard';
import { AuthGuard } from '@nestjs/passport';
import { CreateCommentDto } from '../comment/dto/create-comment.dto';
import { CreateCommentCommand } from './commands/impl/create-comment.command';

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
    @CookieDecorator('sub') userId: string,
  ) {
    return this.postService.getAllPosts(query, userId);
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  getOne(
    @Param('id', IsObjectIdPipe) id: string,
    @UserDecorator('id') userId: string | undefined,
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
    @Param('postId', IsObjectIdPipe) postId: string,
    @UserDecorator() user: { id: string; login: string },
    @Body() dto: LikeStatusDto,
  ) {
    return this.postService.likeStatus(
      user.id,
      user.login,
      postId,
      dto.likeStatus,
    );
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(AuthGuard('basic'))
  remove(@Param('id', IsObjectIdPipe) id: string) {
    return this.postService.deletePost(id);
  }

  @Post(':postId/comments')
  @UseGuards(JwtAccessAuthGuard)
  createComment(
    @UserDecorator('id') userId: string,
    @Param('postId', IsObjectIdPipe) postId: string,
    @Body() dto: CreateCommentDto,
  ) {
    return this.commandBus.execute(
      new CreateCommentCommand(userId, postId, dto.content),
    );
  }

  @Get(':postId/comments')
  @UseGuards(JwtGuard)
  getPostsComments(
    @Param('postId', IsObjectIdPipe) postId: string,
    @Query(PaginationQueryPipe) query: PaginationInputType,
    @UserDecorator('id') userId: string,
  ) {
    return this.postService.getPostComments(postId, query, userId);
  }
}
