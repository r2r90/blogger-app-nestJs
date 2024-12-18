import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from '../../../db/db-mongo/schemas/post.schema';
import {
  PaginationInputType,
  PaginationType,
} from '../../../common/pagination/pagination.types';
import { PostMapper, PostOutputType } from '../mapper/post.mapper';
import {
  CommentMapper,
  CommentOutputType,
} from '../../comment/mapper/comment.mapper';
import { PostLike } from '../../../db/db-mongo/schemas/post-likes.schema';
import {
  Comment,
  CommentDocument,
} from '../../../db/db-mongo/schemas/comments.schema';
import { CommentRepository } from '../../comment/repositories/comment.repository';

@Injectable()
export class PostQueryRepository {
  constructor(
    private readonly postMapper: PostMapper,
    private readonly commentMapper: CommentMapper,
    private readonly commentRepository: CommentRepository,
    @InjectModel(Post.name)
    private readonly postModel: Model<PostDocument>,
    @InjectModel(PostLike.name)
    private readonly postLikeModel: Model<PostLike>,
    @InjectModel(Comment.name)
    private readonly commentModel: Model<CommentDocument>,
  ) {}

  async getAll(
    query: PaginationInputType,
    userId?: string,
  ): Promise<PaginationType<PostOutputType>> {
    const { searchNameTerm, pageNumber, pageSize, sortDirection, sortBy } =
      query;
    let filter = {};
    if (searchNameTerm) {
      filter = {
        name: {
          $regex: new RegExp(searchNameTerm, 'i'),
        },
      };
    }
    const posts = await this.postModel
      .find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);
    const totalCount = await this.postModel.countDocuments(filter);
    const pagesCount = Math.ceil(totalCount / pageSize);

    const postOutput = await Promise.all(
      posts.map(async (post) => {
        const likeInfo = await this.getLikesByPostId(post.id);
        return this.postMapper.mapPost(post, likeInfo, userId);
      }),
    );

    return {
      pagesCount,
      page: pageNumber,
      pageSize: pageSize,
      totalCount,
      items: postOutput,
    };
  }

  async getPostById(id: string, userId?: string) {
    const post = await this.postModel.findById(id);
    const likeInfo = await this.getLikesByPostId(id);
    if (!post) throw new NotFoundException(`Post with id ${id} not found`);
    return this.postMapper.mapPost(post, likeInfo, userId);
  }

  async findPostsByBlogId(
    blogId: string,
    query: PaginationInputType,
    userId?: string,
  ) {
    const { searchNameTerm, pageNumber, pageSize, sortDirection, sortBy } =
      query;
    let filter = {};
    if (searchNameTerm) {
      filter = {
        name: {
          $regex: new RegExp(searchNameTerm, 'i'),
        },
      };
    }

    const posts = await this.postModel
      .find({ blogId })
      .sort({ [sortBy]: sortDirection })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    if (!posts) throw new NotFoundException('No posts found');
    const totalCount = await this.postModel.countDocuments({ blogId }, filter);
    const pagesCount = Math.ceil(totalCount / pageSize);

    const postOutput = await Promise.all(
      posts.map(async (post) => {
        const likeInfo = await this.getLikesByPostId(post.id);
        return this.postMapper.mapPost(post, likeInfo, userId);
      }),
    );

    return {
      pagesCount,
      page: pageNumber,
      pageSize: pageSize,
      totalCount,
      items: postOutput,
    };
  }

  getLikesByPostId(postId: string): Promise<PostLike[]> {
    return this.postLikeModel.find({ postId }).lean();
  }

  // getCommentsByPostId(postId: string): Promise<Comment[]> {
  //   return this.commentModel.find({ postId }).lean();
  // }

  async userAlreadyLikedPost(postId: string, userId: string) {
    const user = await this.postLikeModel.findOne({ postId, userId });
    if (!user) return null;
    return user;
  }

  async getCommentsByPostId(
    postId: string,
    query: PaginationInputType,
    userId?: string,
  ): Promise<PaginationType<CommentOutputType>> {
    const { pageNumber, pageSize, sortDirection, sortBy } = query;
    let filter = { postId };
    const comments = await this.commentModel
      .find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);
    const totalCount = await this.commentModel.countDocuments(filter);
    const pagesCount = Math.ceil(totalCount / pageSize);

    const commentOutput = await Promise.all(
      comments.map(async (comment) => {
        const likeInfo = await this.commentRepository.getLikesByCommentId(
          comment.id,
        );
        return this.commentMapper.mapComments(comment, likeInfo, userId);
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
}
