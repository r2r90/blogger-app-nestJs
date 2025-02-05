import { Injectable } from '@nestjs/common';
import {
  PaginationInputType,
  PaginationType,
} from '../../../common/pagination/pagination.types';
import { PostMapper, PostOutputType } from '../mapper/post.mapper';
import {
  CommentMapper,
  CommentOutputType,
} from '../../comment/mapper/comment.mapper';
import { Post } from '../entity/post.entity';
import { CommentRepository } from '../../comment/repositories/comment.repository';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, ILike, Repository } from 'typeorm';
import { BlogQueryRepository } from '../../blog/repositories/blog.query.repository';
import { CommentQueryRepository } from '../../comment/repositories/comment.query.repository';
import { Comment } from '../../comment/entity/comment.entity';
import { UserService } from '../../user/user.service';
import { GetPostsByBlogIdDto } from '../dto/get-posts-by-blog-id.dto';
import { LikeStatus } from '../../../db/db-mongo/schemas';

class PostWithBlogName {}

@Injectable()
export class PostQueryRepository {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    private readonly blogQueryRepository: BlogQueryRepository,
    private readonly userService: UserService,
    private readonly postMapper: PostMapper,
    private readonly commentMapper: CommentMapper,
    private readonly commentRepository: CommentRepository,
    private readonly commentQueryRepository: CommentQueryRepository,
    @InjectDataSource() protected readonly db: DataSource,
  ) {}

  async getAllPosts(
    query: PaginationInputType,
    userId?: string,
  ): Promise<PaginationType<PostOutputType>> {
    const { pageNumber = 1, pageSize = 10, sortDirection, sortBy } = query;
    const offset = (pageNumber - 1) * pageSize;

    const orderByColumn = sortBy === 'blogName' ? 'b.name' : `p.${sortBy}`;

    const queryResult = await this.db.query(
      `
           WITH found_posts AS (
                                SELECT p.post_id                                                                    AS "id",
                                 b.name                                                                  AS "blogName",
                                 p.blog_id                                                               AS "blogId",
                                 p.content                                                               AS "content",
                                 to_char(p.created_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MSZ') AS "createdAt",
                                 p.short_description                                                     AS "shortDescription",
                                 p.title                                                                 AS "title"
                               FROM posts p 
                               INNER JOIN blogs b ON b.blog_id = p.blog_id
                               ORDER BY ${orderByColumn} ${sortDirection}),
                               paginated_found_posts AS (SELECT *
                                                         FROM found_posts
                                                         LIMIT ${pageSize} OFFSET ${offset})
          SELECT (SELECT COUNT(*)::INTEGER FROM found_posts) AS "totalCount",
                 json_agg(fpm)                               AS items
          FROM (SELECT fp.*,
                       json_build_object(
                               'likesCount', (SELECT COUNT(*)
                                              FROM post_likes pl
                                              WHERE pl.like_status = 'Like'
                                                AND fp.id = pl.post_id),
                               'dislikesCount', (SELECT COUNT(*)
                                                 FROM post_likes pl
                                                 WHERE pl.like_status = 'Dislike'
                                                   AND fp.id = pl.post_id),
                               'myStatus', CASE
                                               WHEN $1::uuid IS NOT NULL THEN COALESCE(
                                                       (SELECT pl.like_status
                                                        FROM post_likes pl
                                                        WHERE pl.user_id = $1::uuid
                                                          AND fp.id = pl.post_id),
                                                       'None'
                                                                              )
                                               ELSE 'None'
                                   END,
                               'newestLikes', (SELECT COALESCE(json_agg(nl), '[]'::json)
                                               FROM (SELECT to_char(pl.created_at AT TIME ZONE 'UTC',
                                                                    'YYYY-MM-DD"T"HH24:MI:SS.MSZ') AS "addedAt",
                                                            u.login                                AS "login",
                                                            u.user_id                                   AS "userId"
                                                     FROM post_likes pl
                                                              INNER JOIN users u ON pl.user_id = u.user_id
                                                     WHERE pl.post_id = fp.id
                                                       AND pl.like_status = 'Like'
                                                     ORDER BY pl.created_at DESC
                                                     LIMIT 3 OFFSET 0) AS nl)
                       ) AS "extendedLikesInfo"
                FROM paginated_found_posts fp) AS fpm;

      `,
      [userId],
    );
    const { totalCount, items } = queryResult[0];

    const pagesCount = Math.ceil(totalCount / pageSize);

    return {
      pagesCount,
      page: pageNumber,
      pageSize,
      totalCount,
      items,
    };
  }

  async getPostsByBlogId(
    query: GetPostsByBlogIdDto,
    userId: string,
  ): Promise<PaginationType<PostOutputType>> {
    const { pageNumber = 1, pageSize = 10, sortDirection, sortBy } = query;

    const validSortFields = ['created_at', 'blogId'];
    const sortByField = validSortFields.includes(sortBy)
      ? sortBy
      : 'created_at';

    const whereConditions: any = [];

    if (query.blogId) {
      whereConditions.push({ blog_id: ILike(`%${query.blogId}%`) });
    }

    const [items, totalCount] = await this.postsRepository.findAndCount({
      where: whereConditions.push({ blog_id: query.blogId }),
      order: {
        [sortByField]: sortDirection.toUpperCase() === 'ASC' ? 'ASC' : 'DESC',
      },
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
    });

    return {
      totalCount,
      pagesCount: Math.ceil(totalCount / pageSize),
      page: pageNumber,
      pageSize,
      items: await Promise.all(
        items.map((post: Post) => this.postMapper.mapPost(post, userId)),
      ),
    };
  }

  async userAlreadyLikedPost(postId: string, userId: string) {
    const query = `
        SELECT *
        FROM post_likes
        WHERE post_id = $1
          AND user_id = $2;
    `;

    const isAlreadyLiked = await this.db.query(query, [postId, userId]);
    if (!isAlreadyLiked[0]) return null;
    return isAlreadyLiked[0];
  }

  async getCommentsByPostId(
    postId: string,
    query: PaginationInputType,
    userId?: string,
  ): Promise<PaginationType<CommentOutputType>> {
    const { pageNumber, pageSize, sortDirection, sortBy } = query;
    const offset = (pageNumber - 1) * pageSize;
    const getCommentsQuery = `
        SELECT *
        FROM comments
        WHERE post_id = $1
        ORDER BY ${sortBy} ${sortDirection.toLowerCase()}
        LIMIT $2 OFFSET $3;
    `;

    const countQuery = `
        SELECT COUNT(*)
        FROM comments
        WHERE post_id = $1
    `;

    const comments = await this.db.query(getCommentsQuery, [
      postId,
      pageSize,
      offset,
    ]);

    const likesQuery = `
        SELECT *
        FROM comment_likes;
    `;
    const countResult = await this.db.query(countQuery, [postId]);

    const totalCount = parseInt(countResult[0].count, 10);
    const pagesCount = Math.ceil(totalCount / pageSize);

    const commentOutput = await Promise.all(
      comments.map(async (comment: Comment) => {
        const likeInfo = await this.commentQueryRepository.getLikesByCommentId(
          comment.comment_id,
        );

        const commentator = await this.userService.getUserById(comment.user_id);

        return this.commentMapper.mapComments(
          comment,
          likeInfo,
          commentator.login,
          userId,
        );
      }),
    );

    return {
      pagesCount,
      page: pageNumber,
      pageSize: pageSize,
      totalCount,
      items: commentOutput,
    };
  }

  async getPostById(postId: string, userId?: string) {
    const post = await this.postsRepository.findOneBy({ id: postId });
    if (!post) {
      return null;
    }
    return this.postMapper.mapPost(post, userId);
  }

  async likesCounter(postId: string, likeStatus: LikeStatus): Promise<number> {
    const countLikesQuery = `
        SELECT COUNT(*) AS count
        FROM post_likes
        WHERE post_id = $1
          AND like_status = $2;
    `;

    const countLikes = await this.db.query(countLikesQuery, [
      postId,
      likeStatus,
    ]);

    return countLikes[0].count;
  }
}
