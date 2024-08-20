import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from '../../db/schemas/blog.schema';
import { Model } from 'mongoose';
import {
  PaginationInputType,
  PaginationType,
} from '../../common/pagination/pagination.types';
import { blogMapper, BlogOutputType } from '../mapper/blog.mapper';
import { Post, PostDocument } from '../../db/schemas/post.schema';
import { postMapper } from '../../post/mapper/post.mapper';

@Injectable()
export class BlogQueryRepository {
  constructor(
    @InjectModel(Blog.name) private readonly blogModel: Model<BlogDocument>,
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
  ) {}

  async getAll(
    query: PaginationInputType,
  ): Promise<PaginationType<BlogOutputType>> {
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
    const blogs = await this.blogModel
      .find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);
    const totalCount = await this.blogModel.countDocuments(filter);
    const pagesCount = Math.ceil(totalCount / pageSize);
    return {
      pagesCount,
      page: pageNumber,
      pageSize: pageSize,
      totalCount,
      items: blogs.map(blogMapper),
    };
  }

  async findOne(id: string) {
    const findedBlog = await this.blogModel.findById(id);
    if (!findedBlog) return null;
    return blogMapper(findedBlog);
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
