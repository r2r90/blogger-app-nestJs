import { PaginationInputType } from '../../../common/pagination/pagination.types';
import { userMapper } from '../mapper/user.mapper';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';

export class UserQueryRepository {
  @InjectDataSource() protected readonly db: DataSource;

  async getAll(query: PaginationInputType) {
    const {
      searchLoginTerm,
      searchEmailTerm,
      pageNumber = 1,
      pageSize = 10,
      sortDirection,
      sortBy,
    } = query;

    const offset = (pageNumber - 1) * pageSize;
    const searchLoginTermNormalized = searchLoginTerm ?? '';
    const searchEmailTermNormalized = searchEmailTerm ?? '';

    const usersQuery = `
        SELECT *
        FROM users
        WHERE (COALESCE($1, '') = '' OR login ILIKE '%' || $1 || '%')
           OR (COALESCE($2, '') = '' OR email ILIKE '%' || $2 || '%')
        ORDER BY ${sortBy} ${sortDirection.toLowerCase()}
        LIMIT $3 OFFSET $4;
    `;

    // Requête pour le comptage total
    const countQuery = `
        SELECT COUNT(*)
        FROM users
        WHERE (COALESCE($1, '') = '' OR login ILIKE '%' || $1 || '%')
           OR (COALESCE($2, '') = '' OR email ILIKE '%' || $2 || '%');
    `;

    const [users, totalCountResult] = await Promise.all([
      this.db.query(usersQuery, [
        searchLoginTermNormalized || '', // $1
        searchEmailTermNormalized || '', // $2
        pageSize, // $3
        offset, // $4
      ]),
      this.db.query(countQuery, [
        searchLoginTermNormalized || '', // $1
        searchEmailTermNormalized || '', // $2
      ]),
    ]);

    const totalCount = parseInt(totalCountResult[0].count, 10);
    const pagesCount = Math.ceil(totalCount / pageSize);

    // Возврат данных
    return {
      pagesCount,
      page: pageNumber,
      pageSize,
      totalCount,
      items: users.map(userMapper),
    };
  }

  async findOne(id: string) {
    const query = `
        SELECT *
        FROM users
        WHERE user_id = $1
    `;

    const findUser = await this.db.query(query, [id]);
    if (!findUser) return null;
    return findUser[0];
  }

  async findUserByFields(fields: { login?: string; email?: string }) {
    const conditions = [];
    const values = [];

    // Формируем условия на основе переданных полей
    if (fields.login) {
      conditions.push(`COALESCE(login, '') ILIKE $${conditions.length + 1}`);
      values.push(fields.login);
    }
    if (fields.email) {
      conditions.push(`COALESCE(email, '') ILIKE $${conditions.length + 1}`);
      values.push(fields.email);
    }

    if (conditions.length === 0) {
      throw new BadRequestException(
        'At least one field (login or email) is required',
      );
    }

    const query = `
        SELECT *
        FROM users
        WHERE ${conditions.join(' OR ')}
    `;

    const findUser = await this.db.query(query, values);

    return findUser[0];
  }

  async findUserByLogin(login: string) {
    if (!login) {
      throw new BadRequestException('Login is required');
    }
    const query = `
        SELECT *
        FROM users
        WHERE COALESCE(login, '') ILIKE $1
    `;

    const findUser = await this.db.query(query, [login]);

    if (findUser.length === 0) {
      new NotFoundException(`Login ${login} not found`);
    }
    return findUser[0];
  }

  async findUserByEmail(email: string) {
    if (!email) {
      throw new BadRequestException('Email is required');
    }

    const query = `
        SELECT *
        FROM users
        WHERE COALESCE(email, '') ILIKE $1
    `;

    const findUser = await this.db.query(query, [email]);
    if (findUser.length === 0) {
      new NotFoundException(`Login ${email} not found`);
    }
    return findUser[0];
  }

  async getUserLoginByPostLikeId(userId: string): Promise<string | null> {
    const getUserQuery = `
        SELECT *
        FROM post_likes
        WHERE user_id = $1
    `;

    const findUser = await this.db.query(getUserQuery, [userId]);
    return findUser[0];
  }
}
