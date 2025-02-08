import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CommentMapper, CommentOutputType } from '../mapper/comment.mapper';
import { UserQueryRepository } from '../../user/repositories/user.query.repository';
import { ICommentLike } from '../entity/comment-likes.entity';
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
    @InjectDataSource()
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
      .leftJoinAndSelect('comment.user', 'user')
      .orderBy(`comment.${sortBy}`, orderDirection)
      .skip((pageNumber - 1) * pageSize)
      .take(pageSize);

    const [items, totalCount] = await queryBuilder.getManyAndCount();

    console.log(items);

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
    const findComment = await this.commentsRepository.findOne({
      where: { id: commentId },
      relations: ['commentLikes'],
    });

    if (!findComment)
      throw new NotFoundException(`Comment with id ${commentId} not found`);
    const author = await this.userQueryRepository.findUserById(
      findComment.user_id,
    );

    if (!author) throw new NotFoundException(`Comment author not found!`);

    return this.commentMapper.mapComments(findComment, author.login, userId);
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
  ): Promise<ICommentLike | null> {
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

    if (checkIsAlreadyLiked.length === 0) return null;
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
        WHERE comment_id = $1
    `;

    const findComment = await this.db.query(searchQuery, [commentId]);

    return findComment.length > 0;
  }
}
