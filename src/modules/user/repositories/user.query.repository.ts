import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, ILike, Like, Repository } from 'typeorm';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { GetUsersDto } from '../dto/get-users.dto';
import { userMapper } from '../mapper/user.mapper';
import { User } from '../entity/user.entity';

export class UserQueryRepository {
  @InjectRepository(User)
  private readonly usersRepository: Repository<User>;
  @InjectDataSource()
  protected readonly db: DataSource;
  @InjectModel(User.name) protected readonly userModel: Model<User>;

  async getAll(query: GetUsersDto) {
    const {
      searchLoginTerm,
      searchEmailTerm,
      pageNumber = 1,
      pageSize = 10,
      sortDirection,
      sortBy,
    } = query;

    const validSortFields = ['login', 'email', 'created_at'];
    const sortByField = validSortFields.includes(sortBy)
      ? sortBy
      : 'created_at';

    const whereConditions: any = [];

    if (searchLoginTerm) {
      whereConditions.push({ login: ILike(`%${searchLoginTerm}%`) });
    }

    if (searchEmailTerm) {
      whereConditions.push({ email: Like(`%${searchEmailTerm}%`) });
    }

    const [items, totalCount] = await this.usersRepository.findAndCount({
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
      items: items.map((user) => userMapper(user)),
    };
  }

  async findUserById(id: string) {
    const user = await this.usersRepository
      .findOne({
        where: { id },
      })
      .catch((err) => {
        throw new BadRequestException(err.message);
      });

    if (!user) return null;
    return user;
  }

  async getUserByConfirmationCode(code: string): Promise<User> {
    const user = await this.usersRepository
      .findOneBy({
        confirmation_code: code,
      })
      .catch((err) => {
        throw new InternalServerErrorException(err.message);
      });
    return user;
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
    const findUser = await this.usersRepository.findOneBy({
      login,
    });

    if (!findUser) return null;
    return findUser;
  }

  async findUserByEmail(email: string) {
    const findUser = await this.usersRepository.findOneBy({
      email,
    });

    if (!findUser) return null;
    return findUser;
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
