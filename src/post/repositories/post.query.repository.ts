import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from '../../common/schemas/post.schema';
import {
  PaginationInputType,
  PaginationType,
} from '../../common/pagination/pagination.types';
import { postMapper, PostOutputType } from '../../common/mappers/post.mapper';

@Injectable()
export class PostQueryRepository {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
  ) {}

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
    const findedPost = await this.postModel.findById(id);
    if (!findedPost) return null;
    return postMapper(findedPost);
  }
}
