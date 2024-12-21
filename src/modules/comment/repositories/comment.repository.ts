import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateCommentDataType } from '../dto/create-comment.dto';

import { LikeCommentStatusInputDataType } from '../../post/dto/like-status.dto';
import { Comment, CommentLike, LikeStatus } from '../../../db/db-mongo/schemas';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CommentQueryRepository } from './comment.query.repository';
import { CommentMapper } from '../mapper/comment.mapper';

@Injectable()
export class CommentRepository {
  constructor(
    @InjectDataSource() protected readonly db: DataSource,
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
    @InjectModel(CommentLike.name)
    private readonly commentLikeModel: Model<CommentLike>,
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
      id: comment.id,
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
        WHERE id = $2
    `;

    const res = await this.db.query(updateCommentQuery, [content, commentId]);
    if (!res) return null;
    return res;
  }

  async remove(id: string) {
    const deleteCommentQuery = `
        DELETE
        FROM comments
        WHERE id = $1
    `;

    const res = await this.db.query(deleteCommentQuery, [id]);
    if (!res) return null;
    return res;
  }

  async likeComment(data: LikeCommentStatusInputDataType): Promise<any> {
    const { userId, commentId, likeStatus } = data;
    const isAlreadyLiked = await this.commentQueryRepository.isUserAlreadyLiked(
      commentId,
      userId,
    );

    const likedUserData = {
      ...data,
      addedAt: new Date().toISOString(),
    };

    if (isAlreadyLiked && isAlreadyLiked.likeStatus !== likeStatus) {
      await this.commentLikeModel.updateOne(
        { _id: isAlreadyLiked.id },
        { likeStatus: likeStatus, addedAt: new Date().toISOString() },
        { new: true },
      );
    }

    if (!isAlreadyLiked && likedUserData.likeStatus !== LikeStatus.None) {
      await this.commentLikeModel.create(likedUserData);
    }

    return null;
  }
}
