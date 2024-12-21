import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from '../../../db/db-mongo/schemas/blog.schema';
import { Model } from 'mongoose';
import {
  PaginationInputType,
  PaginationType,
} from '../../../common/pagination/pagination.types';
import { blogMapper, BlogOutputType } from '../mapper/blog.mapper';
import { Post, PostDocument } from '../../../db/db-mongo/schemas';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class BlogQueryRepository {
  constructor(
    @InjectDataSource() protected readonly db: DataSource,
    @InjectModel(Blog.name) private readonly blogModel: Model<BlogDocument>,
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
  ) {}

  async getAll(
    query: PaginationInputType,
  ): Promise<PaginationType<BlogOutputType>> {
    const {
      searchNameTerm,
      pageNumber = 1,
      pageSize = 10,
      sortDirection,
      sortBy,
    } = query;

    const offset = (pageNumber - 1) * pageSize;
    const searchNameTermNormalized = searchNameTerm ?? '';

    const blogsQuery = `
        SELECT *
        FROM blogs
        WHERE (COALESCE($1, '') = '' OR name ILIKE '%' || $1 || '%')
        ORDER BY ${sortBy} ${sortDirection.toLowerCase()}
        LIMIT $2 OFFSET $3;
    `;

    // Requête pour le comptage total
    const countQuery = `
        SELECT COUNT(*)
        FROM blogs
        WHERE (COALESCE($1, '') = '' OR name ILIKE '%' || $1 || '%')
    `;

    const [blogs, totalCountResult] = await Promise.all([
      this.db.query(blogsQuery, [
        searchNameTermNormalized || '', // $1
        pageSize, // $2
        offset, // $3
      ]),
      this.db.query(countQuery, [
        searchNameTermNormalized || '', // $1
      ]),
    ]);

    const totalCount = parseInt(totalCountResult[0].count, 10);
    const pagesCount = Math.ceil(totalCount / pageSize);

    return {
      pagesCount,
      page: pageNumber,
      pageSize,
      totalCount,
      items: blogs.map(blogMapper),
    };
  }

  async findOne(id: string) {
    const query = `
        SELECT *
        FROM blogs
        WHERE id = $1
    `;

    const findBlog = await this.db.query(query, [id]);
    if (findBlog.length === 0) return null;

    return findBlog.map(blogMapper)[0];
  }
}
