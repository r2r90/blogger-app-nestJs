import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from '../../db/schemas/post.schema';
import {
  PaginationInputType,
  PaginationType,
} from '../../common/pagination/pagination.types';
import { PostMapper, PostOutputType } from '../mapper/post.mapper';
import { PostLike } from '../../db/schemas/post-likes.schema';

@Injectable()
export class PostQueryRepository {
  constructor(
    private readonly postMapper: PostMapper,
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
    @InjectModel(PostLike.name) private readonly postLikeModel: Model<PostLike>,
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

  async findOne(id: string, userId?: string) {
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

  async userAlreadyLiked(postId: string, userId: string) {
    const user = await this.postLikeModel.findOne({ postId, userId });
    if (!user) return null;
    return user;
  }
}
