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
import { DataSource, Repository } from 'typeorm';
import { BlogQueryRepository } from '../../blog/repositories/blog.query.repository';
import { CommentQueryRepository } from '../../comment/repositories/comment.query.repository';
import { UserService } from '../../user/user.service';
import { GetPostsByBlogIdDto } from '../dto/get-posts-by-blog-id.dto';
import { LikeStatus } from '../../../db/db-mongo/schemas';

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
    query: GetPostsByBlogIdDto,
    userId: string,
  ): Promise<PaginationType<PostOutputType>> {
    const { pageNumber = 1, pageSize = 10, sortDirection, sortBy } = query;

    const validSortFields = ['createdAt', 'blogName'];
    const sortByField = validSortFields.includes(sortBy)
      ? sortBy
      : 'created_at';

    const orderDirection =
      sortDirection.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const queryBuilder = this.postsRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.blog', 'blog') // Connecting blog table
      .orderBy(
        sortByField === 'blogName' ? 'blog.name' : `post.${sortByField}`,
        orderDirection as 'ASC' | 'DESC',
      )
      .skip((pageNumber - 1) * pageSize)
      .take(pageSize);

    if (query.blogId) {
      queryBuilder.where('post.blog_id = :blogId', { blogId: query.blogId });
    }

    const [items, totalCount] = await queryBuilder.getManyAndCount();

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

  async getPostById(postId: string, userId?: string) {
    const post = await this.postsRepository.findOne({
      where: { id: postId },
      relations: ['blog'],
    });

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
