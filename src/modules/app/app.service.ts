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
} from '../../db/db-mongo/schemas';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<Blog>,
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    @InjectModel(PostLike.name) private postLike: Model<PostLike>,
    @InjectModel(CommentLike.name) private commentLikeModel: Model<CommentLike>,
    @InjectDataSource() private readonly db: DataSource,
  ) {}

  getHello(): string {
    return 'Hello World! ';
  }

  async deleteAllData() {
    await this.db.query(`DELETE
                         FROM "users";`);
    await this.db.query(`DELETE
                         FROM "sessions";`);
    await this.db.query(`DELETE
                         FROM "blogs";`);
    await this.db.query(`DELETE
                         FROM "posts";`);
    await this.db.query(`DELETE
                         FROM "comments";`);
    await this.db.query(`DELETE
                         FROM "comment_likes";`);
    await this.db.query(`DELETE
                         FROM "post_likes";`);

    await this.blogModel.deleteMany({});
    await this.postModel.deleteMany({});
    await this.userModel.deleteMany({});
    await this.postLike.deleteMany({});
    await this.commentModel.deleteMany({});
    await this.commentLikeModel.deleteMany({});
  }
}
