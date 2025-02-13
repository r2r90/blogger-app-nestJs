import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CommentRepository } from './repositories/comment.repository';
import { CommentOutputType } from './mapper/comment.mapper';
import { CreateCommentDto } from './dto/create-comment.dto';

import { CommentQueryRepository } from './repositories/comment.query.repository';
import { LikeStatus } from '../post/dto/like-status.dto';

@Injectable()
export class CommentService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly commentQueryRepository: CommentQueryRepository,
  ) {}

  async findCommentById(
    commentId: string,
    userId?: string,
  ): Promise<CommentOutputType> {
    return await this.commentQueryRepository.getCommentById(commentId, userId);
  }

  async updateCommentContent(
    commentId: string,
    userId: string,
    updateCommentData: CreateCommentDto,
  ) {
    const { content } = updateCommentData;
    const comment = await this.findCommentById(commentId);
    if (!comment) {
      throw new NotFoundException('IComment does not exist');
    }
    if (comment.commentatorInfo.userId !== userId) {
      throw new ForbiddenException(
        `Unauthorized: ${userId} to delete ${comment.id}`,
      );
    }
    return this.commentRepository.updateContent(commentId, content);
  }

  async removeCommentById(id: string, userId: string) {
    const comment = await this.findCommentById(id);
    if (!comment) {
      throw new NotFoundException('IComment does not exist');
    }

    const isOwner = comment.commentatorInfo.userId.toString() === userId;
    if (!isOwner)
      throw new ForbiddenException(
        `Unauthorized: ${userId} to delete ${comment.id}`,
      );
    return this.commentRepository.remove(id);
  }

  async likeStatus(userId: string, commentId: string, likeStatus: LikeStatus) {
    const comment = await this.commentQueryRepository.getCommentById(commentId);

    if (!comment) throw new NotFoundException();

    const data = { userId, commentId, likeStatus };

    return await this.commentRepository.likeComment(data);
  }
}
