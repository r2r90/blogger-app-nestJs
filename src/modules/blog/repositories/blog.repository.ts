import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from '../../../db/db-mongo/schemas/blog.schema';
import { Model } from 'mongoose';
import { CreateBlogDto } from '../dto/create.blog.dto';
import { BlogOutputType } from '../mapper/blog.mapper';
import { BlogQueryRepository } from './blog.query.repository';

@Injectable()
export class BlogRepository {
  constructor(private readonly blogQueryRepository: BlogQueryRepository) {}

  @InjectModel(Blog.name) private blogModel: Model<Blog>;

  async create(data: CreateBlogDto): Promise<BlogOutputType> {
    const createdAt = new Date().toISOString();
    const createdBlog = new this.blogModel({ ...data, createdAt });
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
    const isBlogExist = await this.blogQueryRepository.findOne(id);
    if (!isBlogExist)
      throw new NotFoundException(
        "Can't update the Blog - Blog does not exist",
      );
    const res = await this.blogModel.findOneAndUpdate(
      { _id: id },
      updateBlogDto,
      {
        new: true,
      },
    );
    if (!res) throw new NotFoundException('Document not found');
    return res;
  }

  async removeBlog(id: string): Promise<any> {
    const blogToDelete = await this.blogQueryRepository.findOne(id);
    if (!blogToDelete) throw new NotFoundException('Cannot delete blog id');
    const res = await this.blogModel.findByIdAndDelete(id);
    if (!res) return null;
    return res;
  }
}
