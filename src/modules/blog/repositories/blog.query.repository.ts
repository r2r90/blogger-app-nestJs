import { BadRequestException, Injectable } from '@nestjs/common';
import { PaginationType } from '../../../common/pagination/pagination.types';
import { blogMapper, BlogOutputType } from '../mapper/blog.mapper';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, ILike, Repository } from 'typeorm';
import { Blog } from '../entity/blog.entity';
import { GetBlogsDto } from '../dto/get-blogs.dto';

@Injectable()
export class BlogQueryRepository {
  constructor(
    @InjectRepository(Blog)
    protected readonly blogsRepository: Repository<Blog>,
    @InjectDataSource() protected readonly db: DataSource,
  ) {}

  async getAll(query: GetBlogsDto): Promise<PaginationType<BlogOutputType>> {
    const {
      searchNameTerm,
      pageNumber = 1,
      pageSize = 10,
      sortDirection,
      sortBy,
    } = query;

    const validSortFields = ['name', 'created_at'];
    const sortByField = validSortFields.includes(sortBy)
      ? sortBy
      : 'created_at';

    const whereConditions: any = [];

    if (searchNameTerm) {
      whereConditions.push({ name: ILike(`%${searchNameTerm}%`) });
    }

    const [items, totalCount] = await this.blogsRepository.findAndCount({
      where: whereConditions.length > 0 ? whereConditions : undefined,
      order: {
        [sortByField]: sortDirection.toUpperCase() === 'ASC' ? 'ASC' : 'DESC',
      },
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
    });

    return {
      totalCount,
      pagesCount: Math.ceil(totalCount / pageSize),
      page: pageNumber,
      pageSize,
      items: items.map((blog: Blog) => blogMapper(blog)),
    };
  }

  async findOneBlog(id: string) {
    const blog = await this.blogsRepository
      .findOne({
        where: { id },
      })
      .catch((err) => {
        throw new BadRequestException(err.message);
      });

    if (!blog) return null;
    return blogMapper(blog);
  }
}
