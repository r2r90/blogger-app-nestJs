import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CommentMapper, CommentOutputType } from '../mapper/comment.mapper';
import { UserQueryRepository } from '../../user/repositories/user.query.repository';
import { CommentLike, ICommentLike } from '../entity/comment-likes.entity';
import { Comment } from '../entity/comment.entity';
import {
  PaginationInputType,
  PaginationType,
} from '../../../common/pagination/pagination.types';

@Injectable()
export class CommentQueryRepository {
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
    @InjectRepository(CommentLike)
    private readonly commentLikesRepository: Repository<CommentLike>,
    protected readonly db: DataSource,
    private readonly userQueryRepository: UserQueryRepository,
    private readonly commentMapper: CommentMapper,
  ) {}

  async getCommentsByPostId(
    postId: string,
    query: PaginationInputType,
    userId?: string,
  ): Promise<PaginationType<CommentOutputType>> {
    const { pageNumber, pageSize, sortDirection, sortBy } = query;
    const orderDirection =
      sortDirection.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const queryBuilder = this.commentsRepository
      .createQueryBuilder('comment')
      .leftJoin('comment.user', 'user')
      .leftJoinAndSelect('comment.comment_likes', 'comment_likes')
      .addSelect(['user.id', 'user.login'])
      .where('comment.post_id = :postId', { postId })
      .orderBy(`comment.${sortBy}`, orderDirection)
      .skip((pageNumber - 1) * pageSize)
      .take(pageSize);

    const [items, totalCount] = await queryBuilder.getManyAndCount();

    return {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount,
      items: await Promise.all(
        items.map((comment) => this.commentMapper.mapComments(comment, userId)),
      ),
    };
  }

  async getCommentById(
    commentId: string,
    userId?: string,
  ): Promise<CommentOutputType> {
    const findComment = await this.commentsRepository
      .createQueryBuilder('comment')
      .leftJoin('comment.user', 'user')
      .leftJoin('comment.comment_likes', 'comment_likes')
      .addSelect([
        'comment.id',
        'comment.content',
        'user.id',
        'user.login',
        'comment_likes',
      ])
      .where('comment.id = :commentId', { commentId })
      .getOne();

    if (!findComment)
      throw new NotFoundException(`Comment with id ${commentId} not found`);

    return this.commentMapper.mapComments(findComment, userId);
  }

  async getLikesByCommentId(commentId: string): Promise<ICommentLike[]> {
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
  ): Promise<CommentLike> {
    return await this.commentLikesRepository.findOneBy({
      comment_id: commentId,
      user_id: userId,
    });
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
        WHERE comment_id = $1
    `;

    const findComment = await this.db.query(searchQuery, [commentId]);

    return findComment.length > 0;
  }
}
