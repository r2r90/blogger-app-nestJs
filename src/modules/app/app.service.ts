import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Blog,
  Comment,
  CommentLike,
  Post,
  PostLike,
  User,
} from '../../db/schemas';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<Blog>,
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    @InjectModel(PostLike.name) private postLike: Model<PostLike>,
    @InjectModel(CommentLike.name) private commentLikeModel: Model<CommentLike>,
  ) {}

  getHello(): string {
    return 'Hello World! ';
  }

  async deleteAllData() {
    await this.blogModel.deleteMany({});
    await this.postModel.deleteMany({});
    await this.userModel.deleteMany({});
    await this.postLike.deleteMany({});
    await this.commentModel.deleteMany({});
    await this.commentLikeModel.deleteMany({});
  }
}
