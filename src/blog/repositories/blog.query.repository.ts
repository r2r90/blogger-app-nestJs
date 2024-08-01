import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from '../entities/blog.schema';
import { Model } from 'mongoose';

@Injectable()
export class BlogQueryRepository {
  constructor(
    @InjectModel(Blog.name) private readonly blogModel: Model<BlogDocument>,
  ) {}

  async getAll() {
    return this.blogModel.find();
  }

  async findOne(id: string) {
    return this.blogModel.findById(id);
  }


}
