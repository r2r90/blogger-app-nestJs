import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBlogDto } from '../dto/create-blog.dto';
import { BlogQueryRepository } from './blog.query.repository';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreatePostDataType } from '../../post/dto/create.post.dto';
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
  // @InjectModel(Blog.name) private blogModel: Model<Blog>;

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

  async createPost(createPostData: CreatePostDataType) {
    const { title, blogId, content, shortDescription } = createPostData;
    const createdAt = new Date().toISOString();
    const createPostQuery = `
        INSERT INTO posts (title, short_description, content, blog_id, created_at)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
    `;

    const createdPost = await this.db.query(createPostQuery, [
      title,
      shortDescription,
      content,
      blogId,
      createdAt,
    ]);

    const postOutputQuery = `
        SELECT posts.post_id           AS post_id,
               posts.title             AS title,
               posts.short_description AS short_description,
               posts.blog_id           AS blog_id,
               posts.content           AS content,
               posts.created_at        AS created_at
        FROM posts
                 LEFT JOIN
             post_likes ON posts.post_id = post_likes.post_id
        WHERE posts.post_id = $1;
    `;

    const data = await this.db.query(postOutputQuery, [createdPost[0].post_id]);
    const post = data[0];

    const blog = await this.blogQueryRepository.findOneBlog(post.blog_id);

    return {
      id: post.post_id,
      title: post.title,
      shortDescription: post.short_description,
      blogId: post.blog_id,
      blogName: blog.name,
      content: post.content,
      createdAt,
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
        newestLikes: [],
      },
    };
  }
}
