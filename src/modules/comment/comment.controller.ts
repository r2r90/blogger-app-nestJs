import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { UserDecorator } from '../../common/decorators/user.decorator';
import { JwtAccessAuthGuard } from '../auth/guards/jwt-access-auth.guard';
import { CreateCommentDto } from './dto/create-comment.dto';
import { LikeStatusDto } from '../post/dto/like-status.dto';
import { JwtGuard } from '../auth/guards/jwt-guard';
import { SkipThrottle } from '@nestjs/throttler';

@SkipThrottle()
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get(':commentId')
  @UseGuards(JwtGuard)
  getCommentById(
    @Param('commentId', new ParseUUIDPipe()) commentId: string,
    @UserDecorator('userId') userId: string,
  ) {
    return this.commentService.findCommentById(commentId, userId);
  }

  @Put(':commentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAccessAuthGuard)
  update(
    @Param('commentId') commentId: string,
    @Body() updateCommentData: CreateCommentDto,
    @UserDecorator('userId') userId: string,
  ) {
    return this.commentService.updateCommentContent(
      commentId,
      userId,
      updateCommentData,
    );
  }

  @Delete(':commentId')
  @HttpCode(204)
  @UseGuards(JwtAccessAuthGuard)
  remove(
    @Param('commentId') id: string,
    @UserDecorator('userId') userId: string,
  ) {
    return this.commentService.removeCommentById(id, userId);
  }

  @Put(':commentId/like-status')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAccessAuthGuard)
  likeComment(
    @Param('commentId') commentId: string,
    @UserDecorator() user: { userId: string; login: string },
    @Body() dto: LikeStatusDto,
  ) {
    return this.commentService.likeStatus(
      user.userId,
      commentId,
      dto.likeStatus,
    );
  }
}
