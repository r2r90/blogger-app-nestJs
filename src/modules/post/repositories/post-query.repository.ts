import { Injectable } from '@nestjs/common';
import { PaginationType } from '../../../common/pagination/pagination.types';
import { PostMapper, PostOutputType } from '../mapper/post.mapper';
import { Post } from '../entity/post.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { GetPostsByBlogIdDto } from '../dto/get-posts-by-blog-id.dto';
import { LikeStatus } from '../dto/like-status.dto';
import { PostLike } from '../entity/post-likes.entity';

@Injectable()
export class PostQueryRepository {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    @InjectRepository(PostLike)
    private readonly postsLikeRepository: Repository<PostLike>,
    private readonly postMapper: PostMapper,
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
      .leftJoinAndSelect('post.blog', 'blog')
      .leftJoinAndSelect('post.postLikes', 'postLikes')
      .leftJoinAndSelect('postLikes.user', 'user')
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
    return await this.postsLikeRepository.findOneBy({
      post_id: postId,
      user_id: userId,
    });
  }

  async getPostById(postId: string, userId?: string) {
    const post = await this.postsRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.blog', 'blog')
      .leftJoinAndSelect('post.postLikes', 'postLikes')
      .leftJoinAndSelect('postLikes.user', 'user')
      .addSelect(['user.id', 'user.login'])
      .where('post.id = :postId', { postId })
      .getOne();

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
