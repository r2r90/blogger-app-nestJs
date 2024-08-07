import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from '../../common/schemas/blog.schema';
import { Model } from 'mongoose';
import { CreateBlogDto } from '../dto /create.blog.dto';
import { BlogOutputType } from '../../common/mappers/blog.mapper';

@Injectable()
export class BlogRepository {
  constructor(@InjectModel(Blog.name) private blogModel: Model<Blog>) {}

  async create(createBlogDto: CreateBlogDto): Promise<BlogOutputType> {
    const createdAt = new Date().toISOString();
    const createdBlog = new this.blogModel({ ...createBlogDto, createdAt });
    const savedBlog = await createdBlog.save();
    return {
      id: savedBlog._id,
      createdAt: savedBlog.createdAt,
      description: savedBlog.description,
      isMembership: savedBlog.isMembership,
      name: savedBlog.name,
      websiteUrl: savedBlog.websiteUrl,
    };
  }

  async update(id: string, updateBlogDto: CreateBlogDto): Promise<any> {
    console.log(id);
    const res = await this.blogModel.findOneAndUpdate(
      { _id: id },
      updateBlogDto,
      {
        new: true,
      },
    );
    if (!res) throw new NotFoundException();
    return res;
  }

  async removeBlog(id: string): Promise<any> {
    const res = await this.blogModel.findByIdAndDelete(id);
    if (!res) return null;
    return res;
  }
}
