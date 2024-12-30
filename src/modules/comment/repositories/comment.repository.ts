import { Injectable } from '@nestjs/common';

import { CreateCommentDataType } from '../dto/create-comment.dto';

import { LikeCommentStatusInputDataType } from '../../post/dto/like-status.dto';
import { LikeStatus } from '../../../db/db-mongo/schemas';
import { CommentLike } from '../entity/comment_like.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CommentQueryRepository } from './comment.query.repository';
import { CommentMapper } from '../mapper/comment.mapper';

@Injectable()
export class CommentRepository {
  constructor(
    @InjectDataSource() protected readonly db: DataSource,
    private readonly commentMapper: CommentMapper,
    private readonly commentQueryRepository: CommentQueryRepository,
  ) {}

  async createComment(createCommentData: CreateCommentDataType) {
    const createdAt = new Date().toISOString();

    const { userId, userLogin, postId, content } = createCommentData;
    const createCommentQuery = `
        INSERT INTO comments (user_id, post_id, content, created_at)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;

    const createdComment = await this.db.query(createCommentQuery, [
      userId,
      postId,
      content,
      createdAt,
    ]);

    const comment = createdComment[0];

    return {
      id: comment.comment_id,
      content: comment.content,
      createdAt: comment.created_at,
      commentatorInfo: {
        userId: comment.user_id,
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
    const updateCommentQuery = `
        UPDATE comments
        SET content = $1
        WHERE comment_id = $2
    `;

    const res = await this.db.query(updateCommentQuery, [content, commentId]);
    if (!res) return null;
    return res;
  }

  async remove(id: string) {
    const deleteCommentQuery = `
        DELETE
        FROM comments
        WHERE comment_id = $1
    `;

    const res = await this.db.query(deleteCommentQuery, [id]);
    if (!res) return null;
    return res;
  }

  async likeComment(data: LikeCommentStatusInputDataType): Promise<any> {
    const { userId, commentId, likeStatus } = data;

    const isAlreadyLiked: CommentLike =
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
        isAlreadyLiked.comment_like_id,
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
