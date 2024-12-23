import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CommentMapper, CommentOutputType } from '../mapper/comment.mapper';
import { UserQueryRepository } from '../../user/repositories/user.query.repository';
import { CommentLike } from '../entity/comment_like.entity';

@Injectable()
export class CommentQueryRepository {
  constructor(
    @InjectDataSource() protected readonly db: DataSource,
    private readonly userQueryRepository: UserQueryRepository,
    private readonly commentMapper: CommentMapper,
  ) {}

  async getCommentById(
    commentId: string,
    userId?: string,
  ): Promise<CommentOutputType> {
    const findCommentQuery = `
        SELECT *
        FROM comments
        WHERE id = $1
    `;

    const findComment = await this.db.query(findCommentQuery, [commentId]);
    const comment = findComment[0];
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    const likeInfo = await this.getLikesByCommentId(commentId);
    const commentator = await this.userQueryRepository.findOne(comment.user_id);

    if (!comment)
      throw new NotFoundException(`Comment with id ${commentId} not found`);
    return this.commentMapper.mapComments(
      comment,
      likeInfo,
      commentator.login,
      userId,
    );
  }

  async getLikesByCommentId(commentId: string): Promise<CommentLike[]> {
    const commentLikesQuery = `
        SELECT *
        FROM comment_likes
        WHERE comment_id = $1
    `;

    return await this.db.query(commentLikesQuery, [commentId]);
  }

  async isUserAlreadyLiked(
    commentId: string,
    userId: string,
  ): Promise<CommentLike | null> {
    const ifAlreadyLikedQuery = `
        SELECT *
        FROM comment_likes
        WHERE comment_id = $1
          AND user_id = $2;
    `;
    const checkIsAlreadyLiked = await this.db.query(ifAlreadyLikedQuery, [
      commentId,
      userId,
    ]);

    if (checkIsAlreadyLiked[0].length === 0) return null;
    return checkIsAlreadyLiked[0];
  }

  async countLikesByCommentId(commentId: string): Promise<number> {
    const countLikesQuery = `
        SELECT likes_count
        FROM comment_likes
        WHERE comment_id = $1
    `;

    const countLikes = await this.db.query(countLikesQuery, [commentId]);

    return countLikes[0].count;
  }

  async countDislikesByCommentId(commentId: string): Promise<number> {
    const countDislikesQuery = `
        SELECT likes_count
        FROM comment_likes
        WHERE comment_id = $1
    `;

    const countDislikes = await this.db.query(countDislikesQuery, [commentId]);

    return countDislikes[0];
  }

  async isCommentExist(commentId: string): Promise<boolean> {
    const searchQuery = `
        SELECT *
        FROM comments
        WHERE id = $1
    `;

    const findComment = await this.db.query(searchQuery, [commentId]);

    return findComment.length > 0;
  }
}
