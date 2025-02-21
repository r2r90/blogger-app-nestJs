import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateBlogDto } from '../dto/create-blog.dto';
import { BlogQueryRepository } from './blog.query.repository';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BlogOutputType } from '../types';
import { Blog } from '../entity/blog.entity';

@Injectable()
export class BlogRepository {
  constructor(
    @InjectRepository(Blog)
    private readonly blogsRepository: Repository<Blog>,
    @InjectDataSource() protected readonly db: DataSource,
    private readonly blogQueryRepository: BlogQueryRepository,
  ) {}

  async create(data: CreateBlogDto): Promise<BlogOutputType> {
    const blog = this.blogsRepository.create({
      name: data.name,
      description: data.description,
      website_url: data.websiteUrl,
    });

    await this.blogsRepository.save(blog).catch((err) => {
      throw new HttpException('Cannot create blog', err);
    });

    return {
      id: blog.id,
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.website_url,
      createdAt: blog.created_at,
      isMembership: blog.is_membership,
    };
  }

  async updateBlog(id: string, updateBlogDto: CreateBlogDto): Promise<any> {
    const isBlogExist = await this.blogQueryRepository.findOneBlog(id);
    if (!isBlogExist)
      throw new NotFoundException(
        "Can't updateBlog the Blog - Blog does not exist",
      );

    const updateBlog = await this.blogsRepository
      .update(id, {
        name: updateBlogDto.name,
        description: updateBlogDto.description,
        website_url: updateBlogDto.websiteUrl,
      })
      .catch((err) => {
        throw new InternalServerErrorException(err);
      });

    return !!updateBlog;
  }

  async removeBlog(id: string): Promise<any> {
    return await this.blogsRepository.delete(id);
  }
}
