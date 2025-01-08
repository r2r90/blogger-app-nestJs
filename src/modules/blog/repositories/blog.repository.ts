import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBlogDto } from '../dto/create-blog.dto';
import { BlogQueryRepository } from './blog.query.repository';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Blog } from '../../../db/db-mongo/schemas';
import { CreatePostDataType } from '../../post/dto/create.post.dto';
import { BlogOutputType } from '../types';

@Injectable()
export class BlogRepository {
  constructor(
    @InjectDataSource() protected readonly db: DataSource,
    private readonly blogQueryRepository: BlogQueryRepository,
  ) {}

  @InjectModel(Blog.name) private blogModel: Model<Blog>;

  async create(data: CreateBlogDto): Promise<BlogOutputType> {
    const createdAt = new Date().toISOString();
    const query = `
        INSERT INTO blogs (name, description, website_url, created_at)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;

    const values = [data.name, data.description, data.websiteUrl, createdAt];

    try {
      const res = await this.db.query(query, values);
      if (!res || res.length === 0) {
        new HttpException(
          'Blog creation failed: no data returned from the database',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      const blog = res[0];

      return {
        id: blog.blog_id,
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.website_url,
        createdAt: blog.created_at,
        isMembership: blog.is_membership,
      };
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async updateBlog(id: string, updateBlogDto: CreateBlogDto): Promise<any> {
    const { name, description, websiteUrl } = updateBlogDto;
    const isBlogExist = await this.blogQueryRepository.findOne(id);
    if (!isBlogExist)
      throw new NotFoundException(
        "Can't updateBlog the Blog - Blog does not exist",
      );
    const fields: string[] = [];
    const values: any[] = [];
    let index = 1;

    if (name) {
      fields.push(`name = $${index++}`);
      values.push(name);
    }
    if (description) {
      fields.push(`description = $${index++}`);
      values.push(description);
    }
    if (websiteUrl) {
      fields.push(`website_url = $${index++}`);
      values.push(websiteUrl);
    }

    // Если нет полей для обновления
    if (fields.length === 0) {
      throw new BadRequestException('No fields to updateBlog');
    }

    // Добавляем id в список параметров
    values.push(id);

    const query = `
        UPDATE blogs
        SET ${fields.join(', ')}
        WHERE blog_id = $${index}`;

    try {
      const res = await this.db.query(query, values);
      return res.rows;
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async removeBlog(id: string): Promise<any> {
    const blogToDelete = await this.blogQueryRepository.findOne(id);
    if (!blogToDelete) throw new NotFoundException('Cannot delete blog id');
    const query = `
        DELETE
        FROM blogs
        WHERE blog_id = $1
    `;
    const res = await this.db.query(query, [id]);

    if (!res.rows) return null;
    return res;
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

    const blog = await this.blogQueryRepository.findOne(post.blog_id);

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
