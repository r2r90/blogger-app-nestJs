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

    const allBlogsQuery = `
            WITH found_blogs AS (
            SELECT 
                    b.id AS "id",            
                    b.name AS "name",            
                    b.description AS "description",            
                    b.website_url AS "websiteUrl",
                    b.is_membership AS "isMembership",
                    to_char(b.created_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MSZ') AS "createdAt"
            FROM blogs b
            ORDER BY ${sortBy} ${sortDirection.toLowerCase()}),
    paginated_found_blogs AS (
            SELECT * 
            FROM found_blogs 
            LIMIT ${pageSize} 
            OFFSET ${offset})
            SELECT (SELECT COUNT(*)::INTEGER FROM found_blogs) AS "totalCount",
                     json_agg(pfb) AS "items"
            FROM paginated_found_blogs pfb;
                                               `;

    const blogsResult = await this.db.query(allBlogsQuery);

    const { items, totalCount } = blogsResult[0];

    const pagesCount = Math.ceil(totalCount / pageSize);

    return {
      pagesCount,
      page: pageNumber,
      pageSize,
      totalCount,
      items,
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
