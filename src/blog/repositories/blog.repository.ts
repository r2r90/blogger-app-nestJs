import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from '../entities/blog.entity';
import { Model } from 'mongoose';
import { CreateBlogDto } from '../dto /createBlog.dto';

@Injectable()
export class BlogRepository {
  constructor(
    @InjectModel(Blog.name) private readonly blogModel: Model<BlogDocument>,
  ) {}

  create(createBlogDto: CreateBlogDto) {
    return this.blogModel.create(createBlogDto);
  }
}
