import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from '../db/schemas/blog.schema';
import { Post } from '../db/schemas/post.schema';
import { Model } from 'mongoose';
import { User } from '../db/schemas/users.schema';
import { PostLike } from '../db/schemas/post-likes.schema';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<Blog>,
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(PostLike.name) private postLike: Model<PostLike>,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async deleteAllData() {
    await this.blogModel.deleteMany({});
    await this.postModel.deleteMany({});
    await this.userModel.deleteMany({});
    await this.postLike.deleteMany({});
  }
}
