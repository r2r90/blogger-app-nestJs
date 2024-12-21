import { Injectable, NotFoundException } from '@nestjs/common';
import {
  PaginationInputType,
  PaginationType,
} from '../../../common/pagination/pagination.types';
import { PostMapper, PostOutputType } from '../mapper/post.mapper';
import {
  CommentMapper,
  CommentOutputType,
} from '../../comment/mapper/comment.mapper';
import { LikeStatus, PostLike } from '../../../db/db-mongo/schemas';
import { PostWithBlogName } from '../entity/post.entity';
import { CommentRepository } from '../../comment/repositories/comment.repository';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { BlogQueryRepository } from '../../blog/repositories/blog.query.repository';
import { CommentQueryRepository } from '../../comment/repositories/comment.query.repository';
import { Comment } from '../../comment/entity/comment.entity';
import { UserService } from '../../user/user.service';

@Injectable()
export class PostQueryRepository {
  constructor(
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

    const orderByColumn =
      sortBy === 'blogName' ? 'blogs.name' : `posts.${sortBy}`;

    const postsQuery = `
        SELECT posts.*,
               blogs.name AS blog_name,
               post_likes.user_id AS like_user_id,
               post_likes.like_status AS like_status,
               post_likes.created_at AS like_created_at
        FROM posts
                 JOIN blogs ON posts.blog_id = blogs.id
                 LEFT JOIN post_likes ON posts.id = post_likes.post_id
                WHERE posts.id = $3
        ORDER BY ${orderByColumn} ${sortDirection.toLowerCase()}
        LIMIT $1 OFFSET $2;

    `;

    const postId = '6356269e-f0a8-4c3a-b4b5-9463ce43f7a5';

    const likesQuery = `
        SELECT *
        FROM post_likes;
    `;

    const countQuery = `
        SELECT COUNT(*)
        FROM posts
    `;

    const posts = await this.db.query(postsQuery, [pageSize, offset, postId]);

    console.log(posts);

    const countResult = await this.db.query(countQuery);

    const totalCount = parseInt(countResult[0].count, 10);

    const pagesCount = Math.ceil(totalCount / pageSize);

    const items = posts.map((post) => ({
      id: post.id,
      title: post.title,
      shortDescription: post.short_description,
      content: post.content,
      blogId: post.blog_id,
      blogName: post.blog_name,
      createdAt: post.created_at,
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
        newestLikes: [],
      },
    }));

    return {
      pagesCount,
      page: pageNumber,
      pageSize,
      totalCount,
      items,
    };
  }

  async getPostsByBlogId(
    query: PaginationInputType,
    blogId: string,
    userId: string,
  ): Promise<PaginationType<PostOutputType>> {
    const { pageNumber = 1, pageSize = 10, sortDirection, sortBy } = query;

    const offset = (pageNumber - 1) * pageSize;

    const postsQuery = `
        SELECT posts.*,
               blogs.name AS blog_name
        FROM posts
                 JOIN blogs ON posts.blog_id = blogs.id
        WHERE posts.blog_id = $1
        ORDER BY ${sortBy} ${sortDirection.toLowerCase()}
        LIMIT $2 OFFSET $3;
    `;

    const likesQuery = `
        SELECT u.login,
               p.post_id,
               p.user_id,
               p.like_status,
               p.created_at
        FROM users u
                 INNER JOIN post_likes p
                            ON
                                u.id = p.user_id;
    `;

    const countQuery = `
        SELECT COUNT(*)
        FROM posts
        WHERE blog_id = $1
    `;

    const posts = await this.db.query(postsQuery, [blogId, pageSize, offset]);
    const likes = await this.db.query(likesQuery);
    const countResult = await this.db.query(countQuery, [blogId]);

    const totalCount = parseInt(countResult[0].count, 10);
    const pagesCount = Math.ceil(totalCount / pageSize);

    const postOutput = await Promise.all(
      posts.map(async (post: PostWithBlogName) => {
        return this.postMapper.mapPost(post, likes, userId);
      }),
    );

    return {
      pagesCount,
      page: pageNumber,
      pageSize,
      totalCount,
      items: postOutput,
    };
  }

  async getLikesByPostId(postId: string): Promise<PostLike[]> {
    const postLikesQuery = `
        SELECT *
        FROM post_likes
        WHERE post_id = $1
    `;

    return await this.db.query(postLikesQuery, [postId]);
  }

  // getCommentsByPostId(postId: string): Promise<Comment[]> {
  //   return this.commentModel.find({ postId }).lean();
  // }

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
        ;

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
    const countResult = await this.db.query(countQuery, [postId]);

    const totalCount = parseInt(countResult[0].count, 10);
    const pagesCount = Math.ceil(totalCount / pageSize);

    const commentOutput = await Promise.all(
      comments.map(async (comment: Comment) => {
        const likeInfo = await this.commentQueryRepository.getLikesByCommentId(
          comment.id,
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
    const findPostByIdQuery = `
        SELECT *
        FROM posts
        WHERE id = $1;
    `;

    const likesQuery = `
        SELECT *
        FROM post_likes
        WHERE post_id = $1;
    `;

    const findPost = await this.db.query(findPostByIdQuery, [postId]);
    const likes = await this.db.query(likesQuery, [postId]);
    const post = findPost[0];
    if (!post) {
      throw new NotFoundException(`Post with id ${postId} not found`);
    }

    const blog = await this.blogQueryRepository.findOne(post.blog_id);

    const postWithBlogName: PostWithBlogName = {
      ...post,
      blog_name: blog.name,
    };
    return this.postMapper.mapPost(postWithBlogName, likes, userId);
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

  // async findPostsByBlogId(
  //   blogId: string,
  //   query: PaginationInputType,
  //   userId?: string,
  // ) {
  //   const { searchNameTerm, pageNumber, pageSize, sortDirection, sortBy } =
  //     query;
  //   let filter = {};
  //   if (searchNameTerm) {
  //     filter = {
  //       name: {
  //         $regex: new RegExp(searchNameTerm, 'i'),
  //       },
  //     };
  //   }
  //
  //   const posts = await this.postModel
  //     .find({ blogId })
  //     .sort({ [sortBy]: sortDirection })
  //     .skip((pageNumber - 1) * pageSize)
  //     .limit(pageSize);
  //
  //   if (!posts) throw new NotFoundException('No posts found');
  //   const totalCount = await this.postModel.countDocuments({ blogId }, filter);
  //   const pagesCount = Math.ceil(totalCount / pageSize);
  //
  //   const postOutput = await Promise.all(
  //     posts.map(async (post) => {
  //       const likeInfo = await this.getLikesByPostId(post.id);
  //       return this.postMapper.mapPost(post, likeInfo, userId);
  //     }),
  //   );
  //
  //   return {
  //     pagesCount,
  //     page: pageNumber,
  //     pageSize: pageSize,
  //     totalCount,
  //     items: postOutput,
  //   };
  // }
}
