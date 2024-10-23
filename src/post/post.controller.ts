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
    console.log(userId);
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

  // @Post(':postId/comments')
  // @UseGuards(JwtRefreshAuthGuard)
  // createComment(
  //   @Req() req: Request,
  //   @Param('postId', IsObjectIdPipe) postId: string,
  //   @Body() dto: CreateCommentDto,
  // ) {
  //   const userId = req.user.id.toString();
  //   return this.commandBus.execute(
  //     new CreateCommentCommand(userId, postId, dto.content),
  //   );
  // }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(AuthGuard('basic'))
  remove(@Param('id', IsObjectIdPipe) id: string) {
    return this.postService.deletePost(id);
  }
}


// import { createParamDecorator, ExecutionContext } from '@nestjs/common';
//
// export const Cookies = createParamDecorator((data: string, ctx: ExecutionContext) => {
//   const request = ctx.switchToHttp().getRequest();
//   return data ? request.cookies?.[data] : request.cookies;
// });