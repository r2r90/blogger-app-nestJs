import { Injectable } from '@nestjs/common';

import { CreateCommentDataType } from '../dto/create-comment.dto';

import {
  LikeCommentStatusInputDataType,
  LikeStatus,
} from '../../post/dto/like-status.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CommentQueryRepository } from './comment.query.repository';
import { Comment } from '../entity/comment.entity';
import { CommentLike } from '../entity/comment-likes.entity';

@Injectable()
export class CommentRepository {
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
    @InjectRepository(CommentLike)
    private readonly commentLikesRepository: Repository<CommentLike>,
    @InjectDataSource() protected readonly db: DataSource,
    private readonly commentQueryRepository: CommentQueryRepository,
  ) {}

  async createComment(createCommentData: CreateCommentDataType) {
    const { userId, userLogin, postId, content } = createCommentData;

    const comment = this.commentsRepository.create({
      post_id: postId,
      user_id: userId,
      content,
    });

    const savedComment = await this.commentsRepository.save(comment);

    return {
      id: savedComment.id,
      content: savedComment.content,
      createdAt: savedComment.created_at,
      commentatorInfo: {
        userId: savedComment.user_id,
        userLogin,
      },
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
      },
    };
  }

  async updateContent(commentId: string, content: string) {
    const updateComment = await this.commentsRepository.update(
      {
        id: commentId,
      },
      { content },
    );

    return !!updateComment;
  }

  async remove(id: string) {
    const res = await this.commentsRepository.delete(id);
    return !!res;
  }

  async likeComment(data: LikeCommentStatusInputDataType): Promise<any> {
    const { userId, commentId, likeStatus } = data;

    const isAlreadyLiked: CommentLike =
      await this.commentQueryRepository.isUserAlreadyLiked(commentId, userId);

    if (isAlreadyLiked && isAlreadyLiked.like_status !== likeStatus) {
      await this.commentLikesRepository.update(isAlreadyLiked.id, {
        like_status: likeStatus,
        created_at: new Date(),
      });
    }

    if (!isAlreadyLiked && likeStatus !== LikeStatus.None) {
      const likeComment = this.commentLikesRepository.create({
        user_id: userId,
        comment_id: commentId,
        like_status: likeStatus,
      });

      await this.commentLikesRepository.save(likeComment);
    }

    return null;
  }
}
