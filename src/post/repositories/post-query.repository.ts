import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from '../../db/schemas/post.schema';
import {
  PaginationInputType,
  PaginationType,
} from '../../common/pagination/pagination.types';
import { postMapper, PostOutputType } from '../mapper/post.mapper';

@Injectable()
export class PostQueryRepository {
  constructor() {}

  @InjectModel(Post.name) private readonly postModel: Model<PostDocument>;

  async getAll(
    query: PaginationInputType,
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
    return {
      pagesCount,
      page: pageNumber,
      pageSize: pageSize,
      totalCount,
      items: posts.map(postMapper),
    };
  }

  async findOne(id: string) {

    const post = await this.postModel.findById(id);

    if (!post) throw new NotFoundException(`Post with id ${id} not found`);
    return postMapper(post);
  }

  async findPostsByBlogId(blogId: string, query: PaginationInputType) {
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
    return {
      pagesCount,
      page: pageNumber,
      pageSize: pageSize,
      totalCount,
      items: posts.map(postMapper),
    };
  }
}
