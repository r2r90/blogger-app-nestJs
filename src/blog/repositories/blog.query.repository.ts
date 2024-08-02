import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from '../schemas/blog.schema';
import { Model } from 'mongoose';
import { BlogQueryInputModel } from '../models/blogQuery.input.model';
import { blogMapper } from '../mapper/blog.mapper';

@Injectable()
export class BlogQueryRepository {
  constructor(
    @InjectModel(Blog.name) private readonly blogModel: Model<BlogDocument>,
  ) {}

  async getAll(query: BlogQueryInputModel) {
    const { searchNameTerm, sortBy, sortDirection, pageNumber, pageSize } =
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
      pageSize,
      page: pageNumber,
      pagesCount,
      totalCount,
      items: blogs.map(blogMapper),
    };
  }

  async findOne(id: string) {
    return this.blogModel.findById(id);
  }
}
