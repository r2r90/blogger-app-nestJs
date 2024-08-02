import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from '../blog/schemas/blog.schema';
import { Model } from 'mongoose';

@Injectable()
export class AppService {
  constructor(@InjectModel(Blog.name) private blogModel: Model<Blog>) {}

  getHello(): string {
    return 'Hello World!';
  }

  async deleteAllData() {
    await this.blogModel.deleteMany({});
  }
}
