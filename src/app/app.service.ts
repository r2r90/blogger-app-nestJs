import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from '../common/schemas/blog.schema';
import { Post } from '../common/schemas/post.schema';
import { Model } from 'mongoose';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<Blog>,
    @InjectModel(Post.name) private postModel: Model<Post>,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async deleteAllData() {
    await this.blogModel.deleteMany({});
    await this.postModel.deleteMany({});
  }
}
