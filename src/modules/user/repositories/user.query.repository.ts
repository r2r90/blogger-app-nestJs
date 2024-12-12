import { PaginationInputType } from '../../../common/pagination/pagination.types';
import { userMapper } from '../mapper/user.mapper';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../../db/db-mongo/schemas';
import { Model } from 'mongoose';

export class UserQueryRepository {
  @InjectDataSource() protected readonly db: DataSource;
  @InjectModel(User.name) protected readonly userModel: Model<User>;

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
        WHERE id = $1
    `;

    const findUser = await this.db.query(query, [id]);
    if (!findUser) return null;
    return findUser;
  }

  async findByLoginOrEmail(loginOrEmail: string) {
    const user = await this.userModel.findOne({
      $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
    });

    if (!user) return null;
    return user;
  }

  isEmailExist(email: string) {
    return this.userModel.findOne({
      email: email,
    });
  }

  async getUserByRecoveryCode(code: string) {
    const user = await this.userModel.findOne({
      recoveryCode: code,
    });
    if (!user) return null;
    return user;
  }
}
