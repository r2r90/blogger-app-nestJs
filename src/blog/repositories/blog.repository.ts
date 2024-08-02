import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from '../schemas/blog.schema';
import { Model } from 'mongoose';
import { CreateBlogDto } from '../dto /createBlog.dto';

@Injectable()
export class BlogRepository {
  constructor(@InjectModel(Blog.name) private blogModel: Model<Blog>) {}

  async create(createBlogDto: CreateBlogDto): Promise<BlogDocument> {
    const createdBlog = new this.blogModel(createBlogDto);
    return createdBlog.save();
  }
}
