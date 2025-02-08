import { Injectable } from '@nestjs/common';

import { CreateCommentDataType } from '../dto/create-comment.dto';

import { LikeCommentStatusInputDataType } from '../../post/dto/like-status.dto';
import { LikeStatus } from '../../../db/db-mongo/schemas';
import { ICommentLike } from '../entity/comment-likes.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CommentQueryRepository } from './comment.query.repository';
import { Comment } from '../entity/comment.entity';

@Injectable()
export class CommentRepository {
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
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

    const isAlreadyLiked: ICommentLike =
      await this.commentQueryRepository.isUserAlreadyLiked(commentId, userId);

    const likeQuery = `
        INSERT INTO comment_likes (comment_id, user_id, like_status, created_at)
        VALUES ($1, $2, $3, $4)
        RETURNING *
    `;

    const updateLikeQuery = `
        UPDATE comment_likes
        SET like_status = $1,
            created_at  = $2
        WHERE comment_like_id = $3
          AND user_id = $4
    `;

    const createdAt = new Date().toISOString();

    if (isAlreadyLiked && isAlreadyLiked.like_status !== likeStatus) {
      await this.db.query(updateLikeQuery, [
        likeStatus,
        createdAt,
        isAlreadyLiked.id,
        userId,
      ]);
    }

    if (!isAlreadyLiked && likeStatus !== LikeStatus.None) {
      await this.db.query(likeQuery, [
        commentId,
        userId,
        likeStatus,
        createdAt,
      ]);
    }

    return null;
  }
}
